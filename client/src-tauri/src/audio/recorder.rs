use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{self, Receiver, RecvTimeoutError, Sender};
use std::sync::Arc;
use std::thread::JoinHandle;
use std::time::{Duration, Instant};

use super::mic::MicSource;
use super::system::SystemSource;
use super::{SampleQueue, RECORDING_ACTIVE, TARGET_SAMPLE_RATE};

const STALL_MS: u64 = 2_000;
const LEVEL_INTERVAL: Duration = Duration::from_millis(40);
const FLUSH_INTERVAL: Duration = Duration::from_millis(250);
const LEVEL_WINDOW: usize = (TARGET_SAMPLE_RATE / 100) as usize;

pub type LevelSink = Box<dyn Fn(f32) + Send>;

pub struct StartInfo {
    pub local_id: String,
    pub started_at_ms: i64,
    pub path: PathBuf,
    pub warnings: Vec<String>,
}

pub struct StopInfo {
    pub local_id: String,
    pub started_at_ms: i64,
    pub path: PathBuf,
    pub duration_sec: u32,
    pub source: String,
}

pub enum RecorderState {
    Idle,
    Recording {
        local_id: String,
        started_at_ms: i64,
        path: PathBuf,
        paused_ms: i64,
        paused_at_ms: Option<i64>,
    },
}

pub struct PauseInfo {
    pub paused_ms: i64,
    pub paused_at_ms: Option<i64>,
}

struct Active {
    local_id: String,
    started_at_ms: i64,
    wav_path: PathBuf,
    flac_path: PathBuf,
    source: String,
    mic: Option<MicSource>,
    system: Option<SystemSource>,
    writer_stop: Sender<()>,
    writer: Option<JoinHandle<Result<u64, String>>>,
    paused: Arc<AtomicBool>,
    paused_ms: i64,
    paused_at_ms: Option<i64>,
}

#[derive(Default)]
pub struct Recorder {
    active: Option<Active>,
}

impl Recorder {
    pub fn state(&self) -> RecorderState {
        match &self.active {
            None => RecorderState::Idle,
            Some(a) => RecorderState::Recording {
                local_id: a.local_id.clone(),
                started_at_ms: a.started_at_ms,
                path: a.flac_path.clone(),
                paused_ms: a.paused_ms,
                paused_at_ms: a.paused_at_ms,
            },
        }
    }

    pub fn start(&mut self, recordings_dir: &Path, on_level: LevelSink) -> Result<StartInfo, String> {
        if self.active.is_some() {
            return Err("already recording".into());
        }
        std::fs::create_dir_all(recordings_dir)
            .map_err(|e| format!("failed to create recordings dir: {e}"))?;

        let local_id = uuid::Uuid::new_v4().to_string();
        let wav_path = recordings_dir.join(format!("{local_id}.wav"));
        let flac_path = recordings_dir.join(format!("{local_id}.flac"));

        let mic_queue = SampleQueue::new();
        let sys_queue = SampleQueue::new();
        let mut warnings = Vec::new();

        RECORDING_ACTIVE.store(true, std::sync::atomic::Ordering::Relaxed);

        let mic = match MicSource::start(mic_queue.clone()) {
            Ok(s) => Some(s),
            Err(e) => {
                eprintln!("[voicer] mic capture failed: {e}");
                warnings.push(format!("microphone unavailable: {e}"));
                mic_queue.mark_failed();
                None
            }
        };
        let system = match SystemSource::start(sys_queue.clone()) {
            Ok(s) => Some(s),
            Err(e) => {
                eprintln!("[voicer] system audio capture unavailable: {e}");
                warnings.push(format!("system audio unavailable: {e}"));
                sys_queue.mark_failed();
                None
            }
        };

        if mic.is_none() || system.is_none() {
            RECORDING_ACTIVE.store(false, std::sync::atomic::Ordering::Relaxed);
            if let Some(mic) = mic {
                mic.stop();
            }
            if let Some(system) = system {
                system.stop();
            }
            return Err(format!(
                "missing audio permission, recording not started: {}",
                warnings.join("; ")
            ));
        }

        let source = crate::detect::process::processes_running_input()
            .map(|procs| crate::detect::process::best_source(&procs).0)
            .unwrap_or_default();

        let (writer_stop, stop_rx) = mpsc::channel::<()>();
        let wav_for_writer = wav_path.clone();
        let mic_q = mic_queue.clone();
        let sys_q = sys_queue.clone();
        let paused = Arc::new(AtomicBool::new(false));
        let paused_for_writer = paused.clone();
        let writer = std::thread::Builder::new()
            .name("voicer-recorder-writer".into())
            .spawn(move || {
                writer_loop(
                    &wav_for_writer,
                    &mic_q,
                    &sys_q,
                    &stop_rx,
                    &paused_for_writer,
                    &on_level,
                )
            })
            .map_err(|e| {
                RECORDING_ACTIVE.store(false, std::sync::atomic::Ordering::Relaxed);
                format!("failed to spawn writer thread: {e}")
            })?;

        let started_at_ms = now_ms();
        self.active = Some(Active {
            local_id: local_id.clone(),
            started_at_ms,
            wav_path,
            flac_path: flac_path.clone(),
            source,
            mic,
            system,
            writer_stop,
            writer: Some(writer),
            paused,
            paused_ms: 0,
            paused_at_ms: None,
        });

        Ok(StartInfo {
            local_id,
            started_at_ms,
            path: flac_path,
            warnings,
        })
    }

    pub fn pause(&mut self) -> Result<PauseInfo, String> {
        let active = self.active.as_mut().ok_or("not recording")?;
        if active.paused_at_ms.is_none() {
            active.paused.store(true, Ordering::Relaxed);
            active.paused_at_ms = Some(now_ms());
        }
        Ok(PauseInfo {
            paused_ms: active.paused_ms,
            paused_at_ms: active.paused_at_ms,
        })
    }

    pub fn resume(&mut self) -> Result<PauseInfo, String> {
        let active = self.active.as_mut().ok_or("not recording")?;
        if let Some(paused_at) = active.paused_at_ms.take() {
            active.paused_ms += now_ms() - paused_at;
            active.paused.store(false, Ordering::Relaxed);
        }
        Ok(PauseInfo {
            paused_ms: active.paused_ms,
            paused_at_ms: None,
        })
    }

    pub fn stop(&mut self) -> Result<StopInfo, String> {
        let mut active = self.active.take().ok_or("not recording")?;

        if let Some(mic) = active.mic.take() {
            mic.stop();
        }
        if let Some(system) = active.system.take() {
            system.stop();
        }
        let _ = active.writer_stop.send(());
        let frames = match active.writer.take() {
            Some(join) => join
                .join()
                .map_err(|_| "writer thread panicked".to_string())??,
            None => 0,
        };

        RECORDING_ACTIVE.store(false, std::sync::atomic::Ordering::Relaxed);

        let duration_sec = (frames / TARGET_SAMPLE_RATE as u64) as u32;

        let path = match transcode_wav_to_flac(&active.wav_path, &active.flac_path) {
            Ok(()) => {
                let _ = std::fs::remove_file(&active.wav_path);
                active.flac_path.clone()
            }
            Err(e) => {
                eprintln!("[voicer] FLAC transcode failed, keeping WAV: {e}");
                active.wav_path.clone()
            }
        };

        Ok(StopInfo {
            local_id: active.local_id,
            started_at_ms: active.started_at_ms,
            path,
            duration_sec,
            source: active.source,
        })
    }
}

pub fn now_ms() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

fn writer_loop(
    wav_path: &Path,
    mic_q: &SampleQueue,
    sys_q: &SampleQueue,
    stop_rx: &Receiver<()>,
    paused: &AtomicBool,
    on_level: &LevelSink,
) -> Result<u64, String> {
    let spec = hound::WavSpec {
        channels: 2,
        sample_rate: TARGET_SAMPLE_RATE,
        bits_per_sample: 16,
        sample_format: hound::SampleFormat::Int,
    };
    let mut writer =
        hound::WavWriter::create(wav_path, spec).map_err(|e| format!("wav create: {e}"))?;

    let mut pending_mic: Vec<i16> = Vec::new();
    let mut pending_sys: Vec<i16> = Vec::new();
    let mut frames: u64 = 0;
    let mut last_flush = Instant::now();
    let mut was_paused = false;

    loop {
        let stop = matches!(
            stop_rx.recv_timeout(LEVEL_INTERVAL),
            Ok(()) | Err(RecvTimeoutError::Disconnected)
        );

        let mut mic_chunk = mic_q.take();
        let mut sys_chunk = sys_q.take();

        let is_paused = paused.load(Ordering::Relaxed);
        if is_paused && !stop {
            pending_mic.clear();
            pending_sys.clear();
            if !was_paused {
                on_level(0.0);
            }
            was_paused = true;
            continue;
        }
        was_paused = is_paused;

        on_level(max_window_rms(&mic_chunk).max(max_window_rms(&sys_chunk)));
        pending_mic.append(&mut mic_chunk);
        pending_sys.append(&mut sys_chunk);

        if !stop && last_flush.elapsed() < FLUSH_INTERVAL {
            continue;
        }
        last_flush = Instant::now();

        let mic_healthy = !mic_q.is_failed() && mic_q.millis_since_last_push() < STALL_MS;
        let sys_healthy = !sys_q.is_failed() && sys_q.millis_since_last_push() < STALL_MS;

        let n = if stop {
            pending_mic.len().max(pending_sys.len())
        } else {
            match (mic_healthy, sys_healthy) {
                (true, true) => pending_mic.len().min(pending_sys.len()),
                (true, false) => pending_mic.len(),
                (false, true) => pending_sys.len(),
                (false, false) => pending_mic.len().min(pending_sys.len()),
            }
        };

        for i in 0..n {
            let mic = pending_mic.get(i).copied().unwrap_or(0);
            let sys = pending_sys.get(i).copied().unwrap_or(0);
            let mixed = (mic as i32 + sys as i32).clamp(i16::MIN as i32, i16::MAX as i32) as i16;
            writer
                .write_sample(mixed)
                .and_then(|_| writer.write_sample(mixed))
                .map_err(|e| format!("wav write: {e}"))?;
        }
        pending_mic.drain(..n.min(pending_mic.len()));
        pending_sys.drain(..n.min(pending_sys.len()));
        frames += n as u64;

        if stop {
            break;
        }
    }

    writer
        .finalize()
        .map_err(|e| format!("wav finalize: {e}"))?;
    Ok(frames)
}

fn max_window_rms(samples: &[i16]) -> f32 {
    samples
        .chunks(LEVEL_WINDOW)
        .map(|window| {
            let sum: f64 = window
                .iter()
                .map(|&s| {
                    let v = s as f64 / i16::MAX as f64;
                    v * v
                })
                .sum();
            (sum / window.len() as f64).sqrt() as f32
        })
        .fold(0.0, f32::max)
}

fn transcode_wav_to_flac(wav_path: &Path, flac_path: &Path) -> Result<(), String> {
    use flacenc::component::BitRepr;
    use flacenc::error::Verify;

    let mut reader = hound::WavReader::open(wav_path).map_err(|e| format!("wav open: {e}"))?;
    let spec = reader.spec();
    let samples: Vec<i32> = reader
        .samples::<i16>()
        .map(|s| s.map(i32::from))
        .collect::<Result<_, _>>()
        .map_err(|e| format!("wav read: {e}"))?;

    let config = flacenc::config::Encoder::default()
        .into_verified()
        .map_err(|e| format!("flac config: {e:?}"))?;
    let source = flacenc::source::MemSource::from_samples(
        &samples,
        spec.channels as usize,
        spec.bits_per_sample as usize,
        spec.sample_rate as usize,
    );
    let stream = flacenc::encode_with_fixed_block_size(&config, source, config.block_size)
        .map_err(|e| format!("flac encode: {e:?}"))?;

    let mut sink = flacenc::bitsink::ByteSink::new();
    stream
        .write(&mut sink)
        .map_err(|e| format!("flac serialize: {e:?}"))?;
    std::fs::write(flac_path, sink.as_slice()).map_err(|e| format!("flac write: {e}"))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn transcodes_stereo_wav_to_flac() {
        let dir = std::env::temp_dir().join(format!("voicer-test-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&dir).unwrap();
        let wav = dir.join("a.wav");
        let flac = dir.join("a.flac");

        let spec = hound::WavSpec {
            channels: 2,
            sample_rate: TARGET_SAMPLE_RATE,
            bits_per_sample: 16,
            sample_format: hound::SampleFormat::Int,
        };
        let mut w = hound::WavWriter::create(&wav, spec).unwrap();
        for i in 0..TARGET_SAMPLE_RATE {
            let s = ((i as f32 * 0.05).sin() * 10_000.0) as i16;
            w.write_sample(s).unwrap();
            w.write_sample(-s).unwrap();
        }
        w.finalize().unwrap();

        transcode_wav_to_flac(&wav, &flac).unwrap();
        let bytes = std::fs::read(&flac).unwrap();
        assert_eq!(&bytes[..4], b"fLaC");
        assert!(bytes.len() < std::fs::metadata(&wav).unwrap().len() as usize);
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn resampler_48k_to_16k() {
        let mut rs = crate::audio::Resampler::new(48_000, 16_000);
        let input: Vec<f32> = (0..48_000).map(|i| (i as f32 * 0.01).sin() * 0.5).collect();
        let mut out = Vec::new();
        rs.process(&input, &mut out);
        let expected = 16_000usize;
        assert!(
            (out.len() as i64 - expected as i64).abs() < 8,
            "got {} samples, expected ~{expected}",
            out.len()
        );
    }
}
