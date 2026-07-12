use std::sync::mpsc::{self, Receiver, Sender};
use std::sync::Arc;
use std::thread::JoinHandle;

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{SampleFormat, StreamConfig};

use super::{Resampler, SampleQueue, TARGET_SAMPLE_RATE};

pub struct MicSource {
    stop_tx: Sender<()>,
    join: Option<JoinHandle<()>>,
}

impl MicSource {
    pub fn start(queue: Arc<SampleQueue>) -> Result<Self, String> {
        let (ready_tx, ready_rx) = mpsc::channel::<Result<(), String>>();
        let (stop_tx, stop_rx) = mpsc::channel::<()>();

        let join = std::thread::Builder::new()
            .name("voicer-mic-capture".into())
            .spawn(move || run_capture_thread(queue, ready_tx, stop_rx))
            .map_err(|e| format!("failed to spawn mic thread: {e}"))?;

        match ready_rx.recv() {
            Ok(Ok(())) => Ok(Self {
                stop_tx,
                join: Some(join),
            }),
            Ok(Err(e)) => {
                let _ = join.join();
                Err(e)
            }
            Err(_) => {
                let _ = join.join();
                Err("mic capture thread died before starting".into())
            }
        }
    }

    pub fn stop(mut self) {
        let _ = self.stop_tx.send(());
        if let Some(join) = self.join.take() {
            let _ = join.join();
        }
    }
}

impl Drop for MicSource {
    fn drop(&mut self) {
        let _ = self.stop_tx.send(());
        if let Some(join) = self.join.take() {
            let _ = join.join();
        }
    }
}

fn run_capture_thread(
    queue: Arc<SampleQueue>,
    ready_tx: Sender<Result<(), String>>,
    stop_rx: Receiver<()>,
) {
    let stream = match build_stream(queue.clone()) {
        Ok(stream) => stream,
        Err(e) => {
            queue.mark_failed();
            let _ = ready_tx.send(Err(e));
            return;
        }
    };
    if let Err(e) = stream.play() {
        queue.mark_failed();
        let _ = ready_tx.send(Err(format!("failed to start mic stream: {e}")));
        return;
    }
    let _ = ready_tx.send(Ok(()));
    let _ = stop_rx.recv();
    drop(stream);
}

fn build_stream(queue: Arc<SampleQueue>) -> Result<cpal::Stream, String> {
    let host = cpal::default_host();
    let device = host
        .default_input_device()
        .ok_or_else(|| "no default input device".to_string())?;
    let supported = device
        .default_input_config()
        .map_err(|e| format!("no default input config: {e}"))?;

    let channels = supported.channels() as usize;
    let in_rate = supported.sample_rate();
    let sample_format = supported.sample_format();
    let config: StreamConfig = supported.into();

    let err_queue = queue.clone();
    let err_fn = move |e: cpal::Error| {
        eprintln!("[voicer] mic stream error: {e}");
        err_queue.mark_failed();
    };

    let mut resampler = Resampler::new(in_rate, TARGET_SAMPLE_RATE);
    let mut mono: Vec<f32> = Vec::new();
    let mut out: Vec<i16> = Vec::new();

    let stream = match sample_format {
        SampleFormat::F32 => device.build_input_stream(
            config,
            move |data: &[f32], _| {
                downmix(data, channels, &mut mono);
                out.clear();
                resampler.process(&mono, &mut out);
                queue.push(&out);
            },
            err_fn,
            None,
        ),
        SampleFormat::I16 => device.build_input_stream(
            config,
            move |data: &[i16], _| {
                let scaled: Vec<f32> = data.iter().map(|&s| s as f32 / i16::MAX as f32).collect();
                downmix(&scaled, channels, &mut mono);
                out.clear();
                resampler.process(&mono, &mut out);
                queue.push(&out);
            },
            err_fn,
            None,
        ),
        SampleFormat::U16 => device.build_input_stream(
            config,
            move |data: &[u16], _| {
                let scaled: Vec<f32> = data
                    .iter()
                    .map(|&s| (s as f32 - 32768.0) / 32768.0)
                    .collect();
                downmix(&scaled, channels, &mut mono);
                out.clear();
                resampler.process(&mono, &mut out);
                queue.push(&out);
            },
            err_fn,
            None,
        ),
        other => return Err(format!("unsupported mic sample format: {other:?}")),
    }
    .map_err(|e| format!("failed to build mic stream: {e}"))?;

    Ok(stream)
}

fn downmix(input: &[f32], channels: usize, mono: &mut Vec<f32>) {
    mono.clear();
    if channels <= 1 {
        mono.extend_from_slice(input);
        return;
    }
    for frame in input.chunks_exact(channels) {
        mono.push(frame.iter().sum::<f32>() / channels as f32);
    }
}
