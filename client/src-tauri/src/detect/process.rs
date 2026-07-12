//! Best-effort detection of which process holds the microphone, via
//! CoreAudio process objects (macOS 14.4+).
//!
//! Enumerates `kAudioHardwarePropertyProcessObjectList` on the system audio
//! object and checks `kAudioProcessPropertyIsRunningInput` on each process
//! object. The selector constants are defined manually (four-char codes from
//! `AudioHardware.h`) so this compiles regardless of the local SDK bindings.
//!
//! On older macOS the property queries fail and callers fall back to the
//! device-level "is running somewhere" signal (source = "other").

use std::os::raw::c_void;
use std::ptr;

use core_foundation::base::TCFType;
use core_foundation::string::{CFString, CFStringRef};
use coreaudio_sys::{
    AudioObjectGetPropertyData, AudioObjectGetPropertyDataSize, AudioObjectID,
    AudioObjectPropertyAddress,
};

/// `kAudioObjectSystemObject`
pub const SYSTEM_OBJECT: AudioObjectID = 1;
/// `kAudioObjectPropertyScopeGlobal` ('glob')
pub const SCOPE_GLOBAL: u32 = u32::from_be_bytes(*b"glob");
/// `kAudioObjectPropertyElementMain` (0)
pub const ELEMENT_MAIN: u32 = 0;
/// `kAudioHardwarePropertyProcessObjectList` ('prs#'), macOS 14.4+
const PROP_PROCESS_OBJECT_LIST: u32 = u32::from_be_bytes(*b"prs#");
/// `kAudioProcessPropertyIsRunningInput` ('piri'), macOS 14.4+
const PROP_PROCESS_IS_RUNNING_INPUT: u32 = u32::from_be_bytes(*b"piri");
/// `kAudioProcessPropertyBundleID` ('pbid'), macOS 14.4+
const PROP_PROCESS_BUNDLE_ID: u32 = u32::from_be_bytes(*b"pbid");
/// `kAudioProcessPropertyPID` ('ppid'), macOS 14.4+
const PROP_PROCESS_PID: u32 = u32::from_be_bytes(*b"ppid");

pub fn global_address(selector: u32) -> AudioObjectPropertyAddress {
    AudioObjectPropertyAddress {
        mSelector: selector,
        mScope: SCOPE_GLOBAL,
        mElement: ELEMENT_MAIN,
    }
}

#[derive(Debug, Clone)]
pub struct AudioProcess {
    #[allow(dead_code)] // useful for debugging / future filtering
    pub pid: i32,
    pub bundle_id: String,
}

/// List processes (other than ourselves) that currently capture audio input.
pub fn processes_running_input() -> Result<Vec<AudioProcess>, String> {
    let own_pid = std::process::id() as i32;
    let addr = global_address(PROP_PROCESS_OBJECT_LIST);

    unsafe {
        let mut size: u32 = 0;
        let status =
            AudioObjectGetPropertyDataSize(SYSTEM_OBJECT, &addr, 0, ptr::null(), &mut size);
        if status != 0 {
            return Err(format!("process object list unavailable (status {status})"));
        }
        let count = size as usize / std::mem::size_of::<AudioObjectID>();
        let mut ids = vec![0 as AudioObjectID; count];
        let status = AudioObjectGetPropertyData(
            SYSTEM_OBJECT,
            &addr,
            0,
            ptr::null(),
            &mut size,
            ids.as_mut_ptr() as *mut c_void,
        );
        if status != 0 {
            return Err(format!("process object list read failed (status {status})"));
        }
        ids.truncate(size as usize / std::mem::size_of::<AudioObjectID>());

        let mut result = Vec::new();
        for id in ids {
            if !get_u32_property(id, PROP_PROCESS_IS_RUNNING_INPUT)
                .map(|v| v != 0)
                .unwrap_or(false)
            {
                continue;
            }
            let pid = get_i32_property(id, PROP_PROCESS_PID).unwrap_or(-1);
            if pid == own_pid {
                continue;
            }
            let bundle_id = get_string_property(id, PROP_PROCESS_BUNDLE_ID).unwrap_or_default();
            result.push(AudioProcess { pid, bundle_id });
        }
        Ok(result)
    }
}

/// Map a bundle id to a meeting source string for the `call-detected` payload.
pub fn map_bundle_to_source(bundle_id: &str) -> &'static str {
    let b = bundle_id.to_ascii_lowercase();
    if b.starts_with("us.zoom") {
        return "zoom";
    }
    if b.contains("teams") && b.starts_with("com.microsoft") {
        return "teams";
    }
    if b.starts_with("ru.keepcoder.telegram") || b.starts_with("org.telegram") {
        return "telegram";
    }
    if b.starts_with("com.hnc.discord") {
        return "discord";
    }
    const BROWSERS: &[&str] = &[
        "com.google.chrome",
        "com.apple.safari",
        "company.thebrowser.browser",
        "org.mozilla.firefox",
        "com.microsoft.edgemac",
        "com.brave.browser",
        "com.vivaldi.vivaldi",
        "com.operasoftware.opera",
    ];
    if BROWSERS.iter().any(|p| b.starts_with(p)) {
        return "meet";
    }
    "other"
}

/// Pick the most specific source from a list of capturing processes.
pub fn best_source(processes: &[AudioProcess]) -> (&'static str, Option<String>) {
    let mut best: (&'static str, Option<String>) = ("other", None);
    for p in processes {
        let source = map_bundle_to_source(&p.bundle_id);
        if best.1.is_none() {
            best = (source, Some(p.bundle_id.clone()));
        }
        if source != "other" {
            return (source, Some(p.bundle_id.clone()));
        }
    }
    best
}

unsafe fn get_u32_property(id: AudioObjectID, selector: u32) -> Option<u32> {
    let addr = global_address(selector);
    let mut value: u32 = 0;
    let mut size = std::mem::size_of::<u32>() as u32;
    let status = AudioObjectGetPropertyData(
        id,
        &addr,
        0,
        ptr::null(),
        &mut size,
        &mut value as *mut u32 as *mut c_void,
    );
    (status == 0).then_some(value)
}

unsafe fn get_i32_property(id: AudioObjectID, selector: u32) -> Option<i32> {
    get_u32_property(id, selector).map(|v| v as i32)
}

unsafe fn get_string_property(id: AudioObjectID, selector: u32) -> Option<String> {
    let addr = global_address(selector);
    let mut value: CFStringRef = ptr::null();
    let mut size = std::mem::size_of::<CFStringRef>() as u32;
    let status = AudioObjectGetPropertyData(
        id,
        &addr,
        0,
        ptr::null(),
        &mut size,
        &mut value as *mut CFStringRef as *mut c_void,
    );
    if status != 0 || value.is_null() {
        return None;
    }
    // The property returns a +1 reference; wrap under the create rule so it
    // is released when dropped.
    let s = CFString::wrap_under_create_rule(value);
    Some(s.to_string())
}
