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

use super::process::{self, global_address, SYSTEM_OBJECT};
use crate::audio::RECORDING_ACTIVE;

const PROP_DEFAULT_INPUT_DEVICE: u32 = u32::from_be_bytes(*b"dIn ");
const PROP_IS_RUNNING_SOMEWHERE: u32 = u32::from_be_bytes(*b"gone");

const START_DEBOUNCE: Duration = Duration::from_secs(2);
const END_DEBOUNCE: Duration = Duration::from_secs(2);
const POLL_INTERVAL: Duration = Duration::from_secs(1);

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CallDetectedPayload {
    pub source: String,
    pub bundle_id: Option<String>,
    pub at: i64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CallEndedPayload {
    pub at: i64,
}

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
    let wake_ptr = Box::into_raw(Box::new(wake_tx)) as *mut c_void;

    unsafe {
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
            Phase::Rising(since) if now.duration_since(since) >= START_DEBOUNCE => {
                emit_call_detected(app, &last_source, last_bundle.clone());
                Phase::Active
            }
            Phase::Rising(since) => Phase::Rising(since),
            Phase::Active if !active => Phase::Falling(now),
            Phase::Active => Phase::Active,
            Phase::Falling(_) if active => Phase::Active,
            Phase::Falling(since) if now.duration_since(since) >= END_DEBOUNCE => {
                emit_call_ended(app);
                Phase::Idle
            }
            Phase::Falling(since) => Phase::Falling(since),
        };
    }
}

struct Observation {
    active: bool,
    details: Option<(&'static str, Option<String>)>,
}

fn observe_activity(default_device: Option<AudioObjectID>) -> Option<Observation> {
    match process::processes_running_input() {
        Ok(procs) => {
            let active = !procs.is_empty();
            let details = active.then(|| process::best_source(&procs));
            Some(Observation { active, details })
        }
        Err(_) => {
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
