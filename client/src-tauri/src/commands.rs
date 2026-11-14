use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

#[cfg(target_os = "macos")]
use tauri::Emitter;

#[derive(Default)]
pub struct RecorderHandle {
    #[cfg(target_os = "macos")]
    pub recorder: std::sync::Mutex<crate::audio::recorder::Recorder>,
    #[cfg(target_os = "macos")]
    pub kind: std::sync::Mutex<RecordingKind>,
}

#[derive(Serialize, Deserialize, Clone, Copy, Default, PartialEq, Debug)]
#[serde(rename_all = "lowercase")]
pub enum RecordingKind {
    #[default]
    Call,
    Interview,
}

#[derive(Serialize, Clone)]
pub struct LevelDto {
    pub level: f32,
    pub kind: RecordingKind,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct StartRecordingResult {
    pub local_id: String,
    pub started_at: i64,
    pub path: String,
    pub warnings: Vec<String>,
    pub kind: RecordingKind,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct StopRecordingResult {
    pub path: String,
    pub duration_sec: u32,
    pub local_id: String,
    pub started_at: i64,
    pub source: String,
    pub kind: RecordingKind,
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
        kind: RecordingKind,
    },
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PauseStateDto {
    pub paused_ms: i64,
    pub paused_at: Option<i64>,
    pub kind: RecordingKind,
}

#[cfg(target_os = "macos")]
fn lock_state<'a, T>(
    mutex: &'a std::sync::Mutex<T>,
    name: &str,
) -> Result<std::sync::MutexGuard<'a, T>, String> {
    mutex.lock().map_err(|_| format!("{name} lock poisoned"))
}

#[cfg(target_os = "macos")]
fn current_kind(state: &RecorderHandle) -> Result<RecordingKind, String> {
    lock_state(&state.kind, "recorder kind").map(|kind| *kind)
}

pub fn recordings_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("failed to resolve app data dir: {e}"))?;
    Ok(dir.join("recordings"))
}

#[tauri::command]
pub fn start_recording(
    app: AppHandle,
    kind: Option<RecordingKind>,
) -> Result<StartRecordingResult, String> {
    #[cfg(target_os = "macos")]
    {
        let kind = kind.unwrap_or_default();
        let state = app.state::<RecorderHandle>();
        let dir = recordings_dir(&app)?;
        let info = {
            let mut recorder = lock_state(&state.recorder, "recorder")?;
            let level_app = app.clone();
            recorder.start(
                &dir,
                Box::new(move |level| {
                    let _ = level_app.emit("recording-level", LevelDto { level, kind });
                }),
            )?
        };
        *lock_state(&state.kind, "recorder kind")? = kind;
        let result = StartRecordingResult {
            local_id: info.local_id,
            started_at: info.started_at_ms,
            path: info.path.to_string_lossy().into_owned(),
            warnings: info.warnings,
            kind,
        };
        let _ = app.emit("recording-started", result.clone());
        #[cfg(desktop)]
        crate::tray::update_tray(&app, true);
        Ok(result)
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = (app, kind);
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
        let mut recorder = lock_state(&state.recorder, "recorder")?;
        recorder.stop()?
    };
    let result = StopRecordingResult {
        path: info.path.to_string_lossy().into_owned(),
        duration_sec: info.duration_sec,
        local_id: info.local_id,
        started_at: info.started_at_ms,
        source: info.source,
        kind: current_kind(&state)?,
    };
    let _ = app.emit("recording-stopped", result.clone());
    #[cfg(desktop)]
    crate::tray::update_tray(app, false);
    Ok(result)
}

#[tauri::command]
pub fn pause_recording(app: AppHandle) -> Result<(), String> {
    change_pause(&app, true)
}

#[tauri::command]
pub fn resume_recording(app: AppHandle) -> Result<(), String> {
    change_pause(&app, false)
}

#[cfg(not(target_os = "macos"))]
fn change_pause(_app: &AppHandle, _pause: bool) -> Result<(), String> {
    Err("recording is only supported on macOS".into())
}

#[cfg(target_os = "macos")]
fn change_pause(app: &AppHandle, pause: bool) -> Result<(), String> {
    let state = app.state::<RecorderHandle>();
    let info = {
        let mut recorder = lock_state(&state.recorder, "recorder")?;
        if pause {
            recorder.pause()?
        } else {
            recorder.resume()?
        }
    };
    let _ = app.emit(
        "recording-pause-changed",
        PauseStateDto {
            paused_ms: info.paused_ms,
            paused_at: info.paused_at_ms,
            kind: current_kind(&state)?,
        },
    );
    Ok(())
}

#[tauri::command]
pub fn get_recorder_state(app: AppHandle) -> Result<RecorderStateDto, String> {
    #[cfg(target_os = "macos")]
    {
        use crate::audio::recorder::RecorderState;
        let state = app.state::<RecorderHandle>();
        let recorder = lock_state(&state.recorder, "recorder")?;
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
                kind: current_kind(&state)?,
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

#[derive(Default)]
pub struct LiveCaptureHandle {
    #[cfg(target_os = "macos")]
    capture: std::sync::Mutex<Option<crate::audio::live::LiveCapture>>,
}

#[cfg(target_os = "macos")]
fn take_live_capture(app: &AppHandle) -> Result<Option<crate::audio::live::LiveCapture>, String> {
    lock_state(&app.state::<LiveCaptureHandle>().capture, "live capture")
        .map(|mut slot| slot.take())
}

#[tauri::command]
pub fn start_live_capture(
    app: AppHandle,
    on_system: tauri::ipc::Channel<tauri::ipc::InvokeResponseBody>,
) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        drop(take_live_capture(&app)?);
        let capture = crate::audio::live::LiveCapture::start(Box::new(move |bytes| {
            on_system
                .send(tauri::ipc::InvokeResponseBody::Raw(bytes))
                .is_ok()
        }))?;
        let state = app.state::<LiveCaptureHandle>();
        let mut slot = lock_state(&state.capture, "live capture")?;
        *slot = Some(capture);
        Ok(())
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = (app, on_system);
        Err("live capture is only supported on macOS".into())
    }
}

#[tauri::command]
pub fn stop_live_capture(app: AppHandle) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        drop(take_live_capture(&app)?);
        Ok(())
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Err("live capture is only supported on macOS".into())
    }
}

#[tauri::command]
pub async fn capture_screenshot() -> Result<tauri::ipc::Response, String> {
    #[cfg(target_os = "macos")]
    {
        let jpeg = tauri::async_runtime::spawn_blocking(crate::screen::capture_main_display_jpeg)
            .await
            .map_err(|e| format!("screenshot task failed: {e}"))??;
        Ok(tauri::ipc::Response::new(jpeg))
    }
    #[cfg(not(target_os = "macos"))]
    {
        Err("screenshots are only supported on macOS".into())
    }
}
