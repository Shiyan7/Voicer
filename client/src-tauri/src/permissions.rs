use objc2::msg_send;
use objc2::runtime::AnyClass;
use objc2_foundation::NSString;

#[link(name = "AVFoundation", kind = "framework")]
extern "C" {}

#[link(name = "CoreGraphics", kind = "framework")]
extern "C" {
    fn CGPreflightScreenCaptureAccess() -> u8;
    fn CGRequestScreenCaptureAccess() -> u8;
}

const AV_AUTHORIZED: isize = 3;

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

pub fn screen_recording_authorized() -> bool {
    unsafe { CGPreflightScreenCaptureAccess() != 0 }
}

pub fn request_screen_recording_access() {
    unsafe {
        CGRequestScreenCaptureAccess();
    }
}
