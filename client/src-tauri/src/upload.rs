use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

use futures_util::TryStreamExt;
use serde::Serialize;
use tauri::{AppHandle, Emitter};

const PROGRESS_GRANULARITY: u64 = 128 * 1024;

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct UploadProgress {
    path: String,
    sent: u64,
    total: u64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct UploadFinished {
    path: String,
    status: u16,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct UploadFailed {
    path: String,
    error: String,
}

pub async fn upload(
    app: AppHandle,
    path: String,
    url: String,
    token: Option<String>,
) -> Result<(), String> {
    match upload_inner(&app, &path, &url, token).await {
        Ok(status) => {
            let _ = app.emit(
                "upload-finished",
                UploadFinished {
                    path: path.clone(),
                    status,
                },
            );
            Ok(())
        }
        Err(error) => {
            let _ = app.emit(
                "upload-failed",
                UploadFailed {
                    path: path.clone(),
                    error: error.clone(),
                },
            );
            Err(error)
        }
    }
}

async fn upload_inner(
    app: &AppHandle,
    path: &str,
    url: &str,
    token: Option<String>,
) -> Result<u16, String> {
    let file_path = crate::commands::resolve_recording_path(app, path)?;
    let file_name = file_path
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| "recording".to_string());
    let mime = if file_name.ends_with(".flac") {
        "audio/flac"
    } else {
        "audio/wav"
    };

    let file = tokio::fs::File::open(&file_path)
        .await
        .map_err(|e| format!("failed to open recording: {e}"))?;
    let total = file
        .metadata()
        .await
        .map_err(|e| format!("failed to stat recording: {e}"))?
        .len();

    let sent = Arc::new(AtomicU64::new(0));
    let last_emitted = Arc::new(AtomicU64::new(0));
    let app_events = app.clone();
    let event_path = path.to_string();

    let stream =
        tokio_util::io::ReaderStream::with_capacity(file, 64 * 1024).inspect_ok(move |chunk| {
            let sent_now =
                sent.fetch_add(chunk.len() as u64, Ordering::Relaxed) + chunk.len() as u64;
            let last = last_emitted.load(Ordering::Relaxed);
            if sent_now >= total || sent_now.saturating_sub(last) >= PROGRESS_GRANULARITY {
                last_emitted.store(sent_now, Ordering::Relaxed);
                let _ = app_events.emit(
                    "upload-progress",
                    UploadProgress {
                        path: event_path.clone(),
                        sent: sent_now,
                        total,
                    },
                );
            }
        });

    let part =
        reqwest::multipart::Part::stream_with_length(reqwest::Body::wrap_stream(stream), total)
            .file_name(file_name)
            .mime_str(mime)
            .map_err(|e| format!("invalid mime: {e}"))?;
    let form = reqwest::multipart::Form::new().part("file", part);

    let client = reqwest::Client::new();
    let mut request = client.post(url).multipart(form);
    if let Some(token) = token {
        request = request.bearer_auth(token);
    }

    let response = request
        .send()
        .await
        .map_err(|e| format!("upload request failed: {e}"))?;

    let status = response.status();
    if status.is_success() {
        Ok(status.as_u16())
    } else {
        let body = response.text().await.unwrap_or_default();
        let body_snippet: String = body.chars().take(300).collect();
        Err(format!("server responded with {status}: {body_snippet}"))
    }
}
