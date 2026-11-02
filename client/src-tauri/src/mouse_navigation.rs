use block2::RcBlock;
use objc2::rc::Retained;
use objc2::runtime::{AnyClass, AnyObject};
use tauri::{AppHandle, Manager};

const OTHER_MOUSE_UP_TYPE: usize = 26;
const SWIPE_TYPE: usize = 31;
const NAVIGATION_EVENTS_MASK: u64 = 1 << OTHER_MOUSE_UP_TYPE | 1 << SWIPE_TYPE;
const MOUSE_BACK_BUTTON: isize = 3;
const MOUSE_FORWARD_BUTTON: isize = 4;

fn navigate(app: &AppHandle, script: &str) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.eval(script);
    }
}

pub fn install(app: AppHandle) {
    let handler = RcBlock::new(move |event: *mut AnyObject| -> *mut AnyObject {
        let kind: usize = unsafe { objc2::msg_send![event, type] };

        if kind == SWIPE_TYPE {
            let delta_x: f64 = unsafe { objc2::msg_send![event, deltaX] };

            if delta_x > 0.0 {
                navigate(&app, "history.back()");
            } else if delta_x < 0.0 {
                navigate(&app, "history.forward()");
            }

            return std::ptr::null_mut();
        }

        let button: isize = unsafe { objc2::msg_send![event, buttonNumber] };

        match button {
            MOUSE_BACK_BUTTON => navigate(&app, "history.back()"),
            MOUSE_FORWARD_BUTTON => navigate(&app, "history.forward()"),
            _ => return event,
        }

        std::ptr::null_mut()
    });

    let Some(ns_event) = AnyClass::get(c"NSEvent") else {
        return;
    };

    let monitor: Option<Retained<AnyObject>> = unsafe {
        objc2::msg_send![
            ns_event,
            addLocalMonitorForEventsMatchingMask: NAVIGATION_EVENTS_MASK,
            handler: &*handler
        ]
    };

    std::mem::forget(monitor);
}
