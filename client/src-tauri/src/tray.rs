use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Manager};

pub const TRAY_ID: &str = "voicer-tray";

pub fn create_tray(app: &AppHandle) -> tauri::Result<()> {
    let stop = MenuItem::with_id(
        app,
        "stop-recording",
        "Остановить запись",
        true,
        None::<&str>,
    )?;
    let open = MenuItem::with_id(app, "open", "Открыть Voicer", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Выйти", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&stop, &open, &quit])?;

    let mut builder = TrayIconBuilder::with_id(TRAY_ID)
        .tooltip("Voicer")
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id().as_ref() {
            "stop-recording" => {
                #[cfg(target_os = "macos")]
                {
                    if let Err(e) = crate::commands::do_stop_recording(app) {
                        eprintln!("[voicer] tray stop failed: {e}");
                    }
                }
                #[cfg(not(target_os = "macos"))]
                {
                    let _ = app;
                }
            }
            "open" => focus_main_window(app),
            "quit" => app.exit(0),
            _ => {}
        });

    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }
    builder.build(app)?;
    Ok(())
}

pub fn update_tray(app: &AppHandle, recording: bool) {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let _ = tray.set_tooltip(Some(if recording {
            "Voicer — идёт запись"
        } else {
            "Voicer"
        }));
        let _ = tray.set_title(if recording { Some("REC") } else { None::<&str> });
    }
}

pub fn focus_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}
