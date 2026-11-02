#[cfg(target_os = "macos")]
mod audio;
mod commands;
#[cfg(target_os = "macos")]
mod detect;
#[cfg(target_os = "macos")]
mod mouse_navigation;
#[cfg(target_os = "macos")]
mod screen;
#[cfg(desktop)]
mod tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    builder = builder
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_autostart::Builder::new().build());
    }

    builder
        .manage(commands::RecorderHandle::default())
        .manage(commands::LiveCaptureHandle::default())
        .invoke_handler(tauri::generate_handler![
            commands::start_recording,
            commands::stop_recording,
            commands::pause_recording,
            commands::resume_recording,
            commands::get_recorder_state,
            commands::delete_recording,
            commands::start_live_capture,
            commands::start_mic_capture,
            commands::stop_live_capture,
            commands::capture_screenshot,
        ])
        .setup(|app| {
            #[cfg(all(desktop, not(debug_assertions)))]
            {
                use tauri_plugin_autostart::ManagerExt;
                let autostart_manager = app.autolaunch();
                let _ = autostart_manager.enable();
            }

            #[cfg(desktop)]
            tray::create_tray(app.handle())?;

            #[cfg(target_os = "macos")]
            detect::mic_activity::spawn(app.handle().clone());

            #[cfg(target_os = "macos")]
            mouse_navigation::install(app.handle().clone());

            let _ = app;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app, event| {
            #[cfg(target_os = "macos")]
            if let tauri::RunEvent::Reopen { .. } = event {
                tray::focus_main_window(app);
            }
        });
}
