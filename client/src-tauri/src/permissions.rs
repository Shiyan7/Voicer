//! Microphone / screen-recording permission helpers (macOS).

use objc2::msg_send;
use objc2::runtime::AnyClass;
use objc2_foundation::NSString;

// Make sure AVFoundation is linked so the AVCaptureDevice class is available
// at runtime, and CoreGraphics for the screen-capture access functions.
#[link(name = "AVFoundation", kind = "framework")]
extern "C" {}

#[link(name = "CoreGraphics", kind = "framework")]
extern "C" {
    fn CGPreflightScreenCaptureAccess() -> u8;
    fn CGRequestScreenCaptureAccess() -> u8;
}

/// `AVAuthorizationStatusAuthorized`
const AV_AUTHORIZED: isize = 3;

fn av_capture_device_class() -> Option<&'static AnyClass> {
    AnyClass::get(c"AVCaptureDevice")
}

/// Is microphone access authorized?
pub fn mic_authorized() -> bool {
    let Some(cls) = av_capture_device_class() else {
        return false;
    };
    // AVMediaTypeAudio == @"soun"
    let media = NSString::from_str("soun");
    let status: isize = unsafe { msg_send![cls, authorizationStatusForMediaType: &*media] };
    status == AV_AUTHORIZED
}

/// Trigger the microphone permission prompt (non-blocking; the completion
/// handler is ignored — the frontend should poll `check_permissions`).
pub fn request_mic_access() {
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

/// Is screen recording (needed for system audio via ScreenCaptureKit) allowed?
pub fn screen_recording_authorized() -> bool {
    unsafe { CGPreflightScreenCaptureAccess() != 0 }
}

/// Trigger the screen recording permission flow (may open System Settings).
pub fn request_screen_recording_access() {
    unsafe {
        CGRequestScreenCaptureAccess();
    }
}
