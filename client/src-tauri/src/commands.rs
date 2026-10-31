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
    pub source: String,
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
        paused_ms: i64,
        paused_at: Option<i64>,
    },
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PauseStateDto {
    pub paused_ms: i64,
    pub paused_at: Option<i64>,
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
            let level_app = app.clone();
            recorder.start(
                &dir,
                Box::new(move |level| {
                    let _ = level_app.emit("recording-level", level);
                }),
            )?
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
        source: info.source,
    };
    let _ = app.emit("recording-stopped", result.clone());
    #[cfg(desktop)]
    crate::tray::update_tray(app, false);
    Ok(result)
}

#[tauri::command]
pub fn pause_recording(app: AppHandle) -> Result<PauseStateDto, String> {
    change_pause(&app, true)
}

#[tauri::command]
pub fn resume_recording(app: AppHandle) -> Result<PauseStateDto, String> {
    change_pause(&app, false)
}

#[cfg(not(target_os = "macos"))]
fn change_pause(_app: &AppHandle, _pause: bool) -> Result<PauseStateDto, String> {
    Err("recording is only supported on macOS".into())
}

#[cfg(target_os = "macos")]
fn change_pause(app: &AppHandle, pause: bool) -> Result<PauseStateDto, String> {
    let state = app.state::<RecorderHandle>();
    let info = {
        let mut recorder = state
            .recorder
            .lock()
            .map_err(|_| "recorder lock poisoned".to_string())?;
        if pause {
            recorder.pause()?
        } else {
            recorder.resume()?
        }
    };
    let result = PauseStateDto {
        paused_ms: info.paused_ms,
        paused_at: info.paused_at_ms,
    };
    let _ = app.emit("recording-pause-changed", result.clone());
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
                paused_ms,
                paused_at_ms,
            } => RecorderStateDto::Recording {
                local_id,
                started_at: started_at_ms,
                path: path.to_string_lossy().into_owned(),
                paused_ms,
                paused_at: paused_at_ms,
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

