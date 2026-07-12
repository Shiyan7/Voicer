#[cfg(target_os = "macos")]
mod audio;
mod commands;
#[cfg(target_os = "macos")]
mod detect;
#[cfg(target_os = "macos")]
mod permissions;
#[cfg(desktop)]
mod tray;
#[cfg(not(any(target_os = "android", target_os = "ios")))]
mod upload;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    builder = builder
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_autostart::Builder::new().build());
    }

    builder
        .manage(commands::RecorderHandle::default())
        .invoke_handler(tauri::generate_handler![
            commands::start_recording,
            commands::stop_recording,
            commands::get_recorder_state,
            commands::delete_recording,
            commands::check_permissions,
            commands::request_permissions,
            commands::upload_recording,
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

            let _ = app;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
