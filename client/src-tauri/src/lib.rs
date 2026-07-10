#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    builder = builder
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_os::init());

    #[cfg(all(desktop, not(debug_assertions)))]
    {
        use tauri_plugin_autostart::ManagerExt;

        builder = builder.setup(|app| {
            let autostart_manager = app.autolaunch();
            let _ = autostart_manager.enable();
            Ok(())
        });
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
