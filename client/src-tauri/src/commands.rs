use std::path::PathBuf;

use serde::Serialize;
use tauri::{AppHandle, Manager};

#[cfg(target_os = "macos")]
use tauri::Emitter;

#[derive(Default)]
pub struct RecorderHandle {
    #[cfg(target_os = "macos")]
    pub recorder: std::sync::Mutex<crate::audio::recorder::Recorder>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct StartRecordingResult {
    pub local_id: String,
    pub started_at: i64,
    pub path: String,
    pub warnings: Vec<String>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct StopRecordingResult {
    pub path: String,
    pub duration_sec: u32,
    pub local_id: String,
    pub started_at: i64,
}

#[derive(Serialize, Clone)]
#[serde(
    tag = "state",
    rename_all = "camelCase",
    rename_all_fields = "camelCase"
)]
#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
pub enum RecorderStateDto {
    Idle,
    Recording {
        local_id: String,
        started_at: i64,
        path: String,
    },
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PermissionsDto {
    pub mic: bool,
    pub system_audio: bool,
}

pub fn recordings_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("failed to resolve app data dir: {e}"))?;
    Ok(dir.join("recordings"))
}

#[tauri::command]
pub fn start_recording(app: AppHandle) -> Result<StartRecordingResult, String> {
    #[cfg(target_os = "macos")]
    {
        let state = app.state::<RecorderHandle>();
        let dir = recordings_dir(&app)?;
        let info = {
            let mut recorder = state
                .recorder
                .lock()
                .map_err(|_| "recorder lock poisoned".to_string())?;
            recorder.start(&dir)?
        };
        let result = StartRecordingResult {
            local_id: info.local_id,
            started_at: info.started_at_ms,
            path: info.path.to_string_lossy().into_owned(),
            warnings: info.warnings,
        };
        let _ = app.emit("recording-started", result.clone());
        #[cfg(desktop)]
        crate::tray::update_tray(&app, true);
        Ok(result)
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Err("recording is only supported on macOS".into())
    }
}

#[tauri::command]
pub fn stop_recording(app: AppHandle) -> Result<StopRecordingResult, String> {
    #[cfg(target_os = "macos")]
    {
        do_stop_recording(&app)
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Err("recording is only supported on macOS".into())
    }
}

#[cfg(target_os = "macos")]
pub fn do_stop_recording(app: &AppHandle) -> Result<StopRecordingResult, String> {
    let state = app.state::<RecorderHandle>();
    let info = {
        let mut recorder = state
            .recorder
            .lock()
            .map_err(|_| "recorder lock poisoned".to_string())?;
        recorder.stop()?
    };
    let result = StopRecordingResult {
        path: info.path.to_string_lossy().into_owned(),
        duration_sec: info.duration_sec,
        local_id: info.local_id,
        started_at: info.started_at_ms,
    };
    let _ = app.emit("recording-stopped", result.clone());
    #[cfg(desktop)]
    crate::tray::update_tray(app, false);
    Ok(result)
}

#[tauri::command]
pub fn get_recorder_state(app: AppHandle) -> Result<RecorderStateDto, String> {
    #[cfg(target_os = "macos")]
    {
        use crate::audio::recorder::RecorderState;
        let state = app.state::<RecorderHandle>();
        let recorder = state
            .recorder
            .lock()
            .map_err(|_| "recorder lock poisoned".to_string())?;
        Ok(match recorder.state() {
            RecorderState::Idle => RecorderStateDto::Idle,
            RecorderState::Recording {
                local_id,
                started_at_ms,
                path,
            } => RecorderStateDto::Recording {
                local_id,
                started_at: started_at_ms,
                path: path.to_string_lossy().into_owned(),
            },
        })
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Ok(RecorderStateDto::Idle)
    }
}

#[tauri::command]
pub fn delete_recording(app: AppHandle, path: String) -> Result<(), String> {
    let file = resolve_recording_path(&app, &path)?;
    std::fs::remove_file(&file).map_err(|e| format!("failed to delete recording: {e}"))
}

pub fn resolve_recording_path(app: &AppHandle, path: &str) -> Result<PathBuf, String> {
    let dir = recordings_dir(app)?;
    let dir = dir
        .canonicalize()
        .map_err(|e| format!("recordings dir not accessible: {e}"))?;
    let file = PathBuf::from(path)
        .canonicalize()
        .map_err(|e| format!("recording not found: {e}"))?;
    if !file.starts_with(&dir) {
        return Err("path is outside the recordings directory".into());
    }
    if !file.is_file() {
        return Err("not a file".into());
    }
    Ok(file)
}

#[tauri::command]
pub fn check_permissions() -> Result<PermissionsDto, String> {
    #[cfg(target_os = "macos")]
    {
        Ok(PermissionsDto {
            mic: crate::permissions::mic_authorized(),
            system_audio: crate::permissions::system_audio_authorized(),
        })
    }
    #[cfg(not(target_os = "macos"))]
    {
        Ok(PermissionsDto {
            mic: false,
            system_audio: false,
        })
    }
}

#[tauri::command]
pub fn request_permissions() -> Result<PermissionsDto, String> {
    #[cfg(target_os = "macos")]
    {
        if !crate::permissions::mic_authorized() {
            crate::permissions::request_mic_access();
        }
        check_permissions()
    }
    #[cfg(not(target_os = "macos"))]
    {
        check_permissions()
    }
}

