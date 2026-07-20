use std::os::raw::c_void;
use std::ptr;

use core_foundation::base::TCFType;
use core_foundation::string::{CFString, CFStringRef};
use coreaudio_sys::{
    AudioObjectGetPropertyData, AudioObjectGetPropertyDataSize, AudioObjectID,
    AudioObjectPropertyAddress,
};

pub const SYSTEM_OBJECT: AudioObjectID = 1;
pub const SCOPE_GLOBAL: u32 = u32::from_be_bytes(*b"glob");
pub const ELEMENT_MAIN: u32 = 0;
const PROP_PROCESS_OBJECT_LIST: u32 = u32::from_be_bytes(*b"prs#");
const PROP_PROCESS_IS_RUNNING_INPUT: u32 = u32::from_be_bytes(*b"piri");
const PROP_PROCESS_BUNDLE_ID: u32 = u32::from_be_bytes(*b"pbid");
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
    pub bundle_id: String,
    pub pid: i32,
}

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
            result.push(AudioProcess { bundle_id, pid });
        }
        Ok(result)
    }
}

fn capitalize(value: &str) -> String {
    let mut chars = value.chars();
    match chars.next() {
        Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
        None => String::new(),
    }
}

fn app_name_for_pid(pid: i32) -> Option<String> {
    use objc2::rc::Retained;
    use objc2::runtime::{AnyClass, AnyObject};
    use objc2_foundation::NSString;

    let cls = AnyClass::get(c"NSRunningApplication")?;
    unsafe {
        let app: Option<Retained<AnyObject>> =
            objc2::msg_send![cls, runningApplicationWithProcessIdentifier: pid];
        let app = app?;
        let name: Option<Retained<NSString>> = objc2::msg_send![&*app, localizedName];
        name.map(|value| value.to_string())
    }
}

fn name_from_bundle(bundle_id: &str) -> String {
    bundle_id
        .rsplit('.')
        .find(|part| !part.is_empty())
        .map(capitalize)
        .unwrap_or_default()
}

pub fn app_display_name(process: &AudioProcess) -> String {
    app_name_for_pid(process.pid)
        .filter(|name| !name.is_empty())
        .unwrap_or_else(|| name_from_bundle(&process.bundle_id))
}

pub fn best_source(processes: &[AudioProcess]) -> (String, Option<String>) {
    for p in processes {
        let name = app_display_name(p);
        if !name.is_empty() {
            return (name, Some(p.bundle_id.clone()));
        }
    }
    (String::new(), None)
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
    let s = CFString::wrap_under_create_rule(value);
    Some(s.to_string())
}
