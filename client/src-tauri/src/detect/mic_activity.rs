//! Call detection.
//!
//! A background thread watches whether some *other* process is capturing the
//! microphone. Primary signal: CoreAudio process objects (macOS 14.4+, see
//! [`super::process`]), which lets us both ignore our own recording streams
//! and identify the calling app. Fallback signal:
//! `kAudioDevicePropertyDeviceIsRunningSomewhere` on the current default
//! input device (in that mode, while we record, detection is frozen because
//! our own stream also flips the property).
//!
//! Debounce: `call-detected` is emitted only after ~5 s of continuous
//! activity, `call-ended` after ~5 s of continuous inactivity.
//!
//! A CoreAudio property listener on the default input device (re-registered
//! when the default device changes) wakes the thread early; otherwise it
//! polls once per second.

use std::os::raw::c_void;
use std::ptr;
use std::sync::mpsc::{self, Receiver, RecvTimeoutError, Sender};
use std::time::{Duration, Instant};

use coreaudio_sys::{
    AudioObjectAddPropertyListener, AudioObjectGetPropertyData, AudioObjectID,
    AudioObjectPropertyAddress, AudioObjectRemovePropertyListener, OSStatus, UInt32,
};
use serde::Serialize;
use tauri::{AppHandle, Emitter};
use tauri_plugin_notification::NotificationExt;

use super::process::{self, global_address, SYSTEM_OBJECT};
use crate::audio::RECORDING_ACTIVE;

/// `kAudioHardwarePropertyDefaultInputDevice` ('dIn ')
const PROP_DEFAULT_INPUT_DEVICE: u32 = u32::from_be_bytes(*b"dIn ");
/// `kAudioDevicePropertyDeviceIsRunningSomewhere` ('gone')
const PROP_IS_RUNNING_SOMEWHERE: u32 = u32::from_be_bytes(*b"gone");

const DEBOUNCE: Duration = Duration::from_secs(5);
const POLL_INTERVAL: Duration = Duration::from_secs(1);

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CallDetectedPayload {
    /// "zoom" | "teams" | "meet" | "other"
    pub source: String,
    pub bundle_id: Option<String>,
    /// Unix millis.
    pub at: i64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CallEndedPayload {
    pub at: i64,
}

/// Spawn the detector thread. Call once from `setup`.
pub fn spawn(app: AppHandle) {
    if let Err(e) = std::thread::Builder::new()
        .name("voicer-call-detector".into())
        .spawn(move || run(&app))
    {
        eprintln!("[voicer] failed to spawn call detector: {e}");
    }
}

enum Phase {
    Idle,
    Rising(Instant),
    Active,
    Falling(Instant),
}

fn run(app: &AppHandle) {
    let (wake_tx, wake_rx): (Sender<()>, Receiver<()>) = mpsc::channel();
    // The sender is shared with C callbacks for the lifetime of the app;
    // leak it intentionally.
    let wake_ptr = Box::into_raw(Box::new(wake_tx)) as *mut c_void;

    unsafe {
        // Wake up when the default input device changes.
        let addr = global_address(PROP_DEFAULT_INPUT_DEVICE);
        AudioObjectAddPropertyListener(SYSTEM_OBJECT, &addr, Some(wake_listener), wake_ptr);
    }

    let mut listened_device: Option<AudioObjectID> = None;
    let mut phase = Phase::Idle;
    let mut last_source = "other".to_string();
    let mut last_bundle: Option<String> = None;

    loop {
        if matches!(
            wake_rx.recv_timeout(POLL_INTERVAL),
            Err(RecvTimeoutError::Disconnected)
        ) {
            break;
        }

        // Keep the "is running somewhere" listener attached to the *current*
        // default input device.
        let device = default_input_device();
        if device != listened_device {
            let run_addr = global_address(PROP_IS_RUNNING_SOMEWHERE);
            unsafe {
                if let Some(old) = listened_device {
                    AudioObjectRemovePropertyListener(old, &run_addr, Some(wake_listener), wake_ptr);
                }
                if let Some(new) = device {
                    AudioObjectAddPropertyListener(new, &run_addr, Some(wake_listener), wake_ptr);
                }
            }
            listened_device = device;
        }

        // Observe current activity; `None` means "cannot tell right now"
        // (fallback path while we ourselves are recording) — freeze the
        // state machine for this tick.
        let Some(observation) = observe_activity(device) else {
            continue;
        };
        if let Some((source, bundle)) = observation.details {
            last_source = source.to_string();
            last_bundle = bundle;
        }
        let active = observation.active;
        let now = Instant::now();

        phase = match phase {
            Phase::Idle if active => Phase::Rising(now),
            Phase::Idle => Phase::Idle,
            Phase::Rising(_) if !active => Phase::Idle,
            Phase::Rising(since) if now.duration_since(since) >= DEBOUNCE => {
                emit_call_detected(app, &last_source, last_bundle.clone());
                Phase::Active
            }
            Phase::Rising(since) => Phase::Rising(since),
            Phase::Active if !active => Phase::Falling(now),
            Phase::Active => Phase::Active,
            Phase::Falling(_) if active => Phase::Active,
            Phase::Falling(since) if now.duration_since(since) >= DEBOUNCE => {
                emit_call_ended(app);
                Phase::Idle
            }
            Phase::Falling(since) => Phase::Falling(since),
        };
    }
}

struct Observation {
    active: bool,
    /// Present when the process-object API gave us the capturing app.
    details: Option<(&'static str, Option<String>)>,
}

fn observe_activity(default_device: Option<AudioObjectID>) -> Option<Observation> {
    match process::processes_running_input() {
        Ok(procs) => {
            // Our own pid is already excluded, so recording does not trip this.
            let active = !procs.is_empty();
            let details = active.then(|| process::best_source(&procs));
            Some(Observation { active, details })
        }
        Err(_) => {
            // Fallback: device-level flag. While we record, our own stream
            // keeps the flag high, so we cannot tell anything — freeze.
            if RECORDING_ACTIVE.load(std::sync::atomic::Ordering::Relaxed) {
                return None;
            }
            let active = default_device.map(is_running_somewhere).unwrap_or(false);
            Some(Observation {
                active,
                details: None,
            })
        }
    }
}

fn emit_call_detected(app: &AppHandle, source: &str, bundle_id: Option<String>) {
    let payload = CallDetectedPayload {
        source: source.to_string(),
        bundle_id,
        at: crate::audio::recorder::now_ms(),
    };
    if let Err(e) = app.emit("call-detected", payload) {
        eprintln!("[voicer] failed to emit call-detected: {e}");
    }
    // Native notification (clicking it activates the app on macOS).
    if !RECORDING_ACTIVE.load(std::sync::atomic::Ordering::Relaxed) {
        let _ = app
            .notification()
            .builder()
            .title("Voicer")
            .body("Идёт звонок — записать?")
            .show();
    }
}

fn emit_call_ended(app: &AppHandle) {
    let payload = CallEndedPayload {
        at: crate::audio::recorder::now_ms(),
    };
    if let Err(e) = app.emit("call-ended", payload) {
        eprintln!("[voicer] failed to emit call-ended: {e}");
    }
}

fn default_input_device() -> Option<AudioObjectID> {
    let addr = global_address(PROP_DEFAULT_INPUT_DEVICE);
    let mut device: AudioObjectID = 0;
    let mut size = std::mem::size_of::<AudioObjectID>() as u32;
    let status = unsafe {
        AudioObjectGetPropertyData(
            SYSTEM_OBJECT,
            &addr,
            0,
            ptr::null(),
            &mut size,
            &mut device as *mut AudioObjectID as *mut c_void,
        )
    };
    (status == 0 && device != 0).then_some(device)
}

fn is_running_somewhere(device: AudioObjectID) -> bool {
    let addr = global_address(PROP_IS_RUNNING_SOMEWHERE);
    let mut value: u32 = 0;
    let mut size = std::mem::size_of::<u32>() as u32;
    let status = unsafe {
        AudioObjectGetPropertyData(
            device,
            &addr,
            0,
            ptr::null(),
            &mut size,
            &mut value as *mut u32 as *mut c_void,
        )
    };
    status == 0 && value != 0
}

unsafe extern "C" fn wake_listener(
    _object: AudioObjectID,
    _num_addresses: UInt32,
    _addresses: *const AudioObjectPropertyAddress,
    client_data: *mut c_void,
) -> OSStatus {
    if !client_data.is_null() {
        let tx = &*(client_data as *const Sender<()>);
        let _ = tx.send(());
    }
    0
}
