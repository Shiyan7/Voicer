use std::ffi::c_void;
use std::sync::atomic::{AtomicBool, Ordering};

use core_foundation::base::TCFType;
use core_foundation::string::{CFString, CFStringRef};
use objc2::msg_send;
use objc2::runtime::AnyClass;
use objc2_foundation::NSString;

#[link(name = "AVFoundation", kind = "framework")]
extern "C" {}

const AV_AUTHORIZED: isize = 3;

pub const TCC_GRANTED: i64 = 0;

static MIC_REQUESTED: AtomicBool = AtomicBool::new(false);

const TCC_PATH: &[u8] = b"/System/Library/PrivateFrameworks/TCC.framework/Versions/A/TCC\0";

type PreflightFn = unsafe extern "C" fn(CFStringRef, *const c_void) -> i64;

fn tcc_preflight(service: &str) -> i64 {
    unsafe {
        let handle = libc::dlopen(TCC_PATH.as_ptr() as *const libc::c_char, libc::RTLD_NOW);
        if handle.is_null() {
            return -1;
        }
        let sym = libc::dlsym(
            handle,
            b"TCCAccessPreflight\0".as_ptr() as *const libc::c_char,
        );
        if sym.is_null() {
            return -1;
        }
        let preflight: PreflightFn = std::mem::transmute(sym);
        let service = CFString::new(service);
        preflight(service.as_concrete_TypeRef(), std::ptr::null())
    }
}

fn av_capture_device_class() -> Option<&'static AnyClass> {
    AnyClass::get(c"AVCaptureDevice")
}

pub fn mic_authorized() -> bool {
    let Some(cls) = av_capture_device_class() else {
        return false;
    };
    let media = NSString::from_str("soun");
    let status: isize = unsafe { msg_send![cls, authorizationStatusForMediaType: &*media] };
    status == AV_AUTHORIZED
}

pub fn request_mic_access() {
    if MIC_REQUESTED.swap(true, Ordering::SeqCst) {
        return;
    }
    let Some(cls) = av_capture_device_class() else {
        return;
    };
    let media = NSString::from_str("soun");
    let handler = block2::RcBlock::new(move |_granted: objc2::runtime::Bool| {});
    unsafe {
        let _: () = msg_send![
            cls,
            requestAccessForMediaType: &*media,
            completionHandler: &*handler
        ];
    }
}

pub fn system_audio_status() -> i64 {
    tcc_preflight("kTCCServiceAudioCapture")
}

pub fn system_audio_authorized() -> bool {
    system_audio_status() == TCC_GRANTED
}
