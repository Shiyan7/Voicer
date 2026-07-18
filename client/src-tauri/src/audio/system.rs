use std::sync::mpsc::{self, Receiver, Sender};
use std::sync::Arc;
use std::thread::JoinHandle;

use cidre::{av, cat, cf, core_audio as ca, ns, os};

use super::{Resampler, SampleQueue, TARGET_SAMPLE_RATE};

const TAP_DEVICE_NAME: &str = "VoicerSystemAudioTap";

pub struct SystemSource {
    stop_tx: Sender<()>,
    join: Option<JoinHandle<()>>,
}

impl SystemSource {
    pub fn start(queue: Arc<SampleQueue>) -> Result<Self, String> {
        let (ready_tx, ready_rx) = mpsc::channel::<Result<(), String>>();
        let (stop_tx, stop_rx) = mpsc::channel::<()>();

        let join = std::thread::Builder::new()
            .name("voicer-system-capture".into())
            .spawn(move || run_capture_thread(queue, ready_tx, stop_rx))
            .map_err(|e| format!("failed to spawn system thread: {e}"))?;

        match ready_rx.recv_timeout(std::time::Duration::from_secs(3)) {
            Ok(Ok(())) => Ok(Self {
                stop_tx,
                join: Some(join),
            }),
            Ok(Err(e)) => {
                let _ = join.join();
                Err(e)
            }
            Err(_) => Err("system audio did not start (permission not granted?)".into()),
        }
    }

    pub fn stop(mut self) {
        let _ = self.stop_tx.send(());
        if let Some(join) = self.join.take() {
            let _ = join.join();
        }
    }
}

impl Drop for SystemSource {
    fn drop(&mut self) {
        let _ = self.stop_tx.send(());
        if let Some(join) = self.join.take() {
            let _ = join.join();
        }
    }
}

#[derive(Clone, Copy)]
enum SampleKind {
    F32,
    F64,
    I32,
    I16,
}

struct Ctx {
    queue: Arc<SampleQueue>,
    resampler: Resampler,
    kind: SampleKind,
    mono: Vec<f32>,
    out: Vec<i16>,
}

fn run_capture_thread(
    queue: Arc<SampleQueue>,
    ready_tx: Sender<Result<(), String>>,
    stop_rx: Receiver<()>,
) {
    match build_and_start(queue.clone()) {
        Ok((started, tap, ctx)) => {
            let _ = ready_tx.send(Ok(()));
            let _ = stop_rx.recv();
            drop(started);
            drop(ctx);
            drop(tap);
        }
        Err(e) => {
            queue.mark_failed();
            let _ = ready_tx.send(Err(e));
        }
    }
}

type StartedTap = (
    ca::hardware::StartedDevice<ca::AggregateDevice>,
    ca::TapGuard,
    Box<Ctx>,
);

fn build_and_start(queue: Arc<SampleQueue>) -> Result<StartedTap, String> {
    let tap_desc = ca::TapDesc::with_mono_global_tap_excluding_processes(&ns::Array::new());
    let tap = tap_desc
        .create_process_tap()
        .map_err(|e| format!("create process tap: {e:?}"))?;

    let asbd = tap.asbd().map_err(|e| format!("tap asbd: {e:?}"))?;
    let in_rate = asbd.sample_rate as u32;
    let kind = sample_kind(&asbd)?;

    let uid = tap.uid().map_err(|e| format!("tap uid: {e:?}"))?;
    let sub_tap = cf::DictionaryOf::with_keys_values(
        &[ca::sub_device_keys::uid()],
        &[uid.as_type_ref()],
    );

    use ca::aggregate_device_keys as agg_keys;
    let agg_desc = cf::DictionaryOf::with_keys_values(
        &[
            agg_keys::is_private(),
            agg_keys::tap_auto_start(),
            agg_keys::name(),
            agg_keys::uid(),
            agg_keys::tap_list(),
        ],
        &[
            cf::Boolean::value_true().as_type_ref(),
            cf::Boolean::value_false(),
            cf::String::from_str(TAP_DEVICE_NAME).as_ref(),
            &cf::Uuid::new().to_cf_string(),
            &cf::ArrayOf::from_slice(&[sub_tap.as_ref()]),
        ],
    );

    let mut ctx = Box::new(Ctx {
        queue,
        resampler: Resampler::new(in_rate.max(1), TARGET_SAMPLE_RATE),
        kind,
        mono: Vec::new(),
        out: Vec::new(),
    });

    let agg_device =
        ca::AggregateDevice::with_desc(&agg_desc).map_err(|e| format!("aggregate device: {e:?}"))?;
    let proc_id = agg_device
        .create_io_proc_id(proc, Some(&mut ctx))
        .map_err(|e| format!("create io proc: {e:?}"))?;
    let started = ca::device_start(agg_device, Some(proc_id))
        .map_err(|e| format!("device start: {e:?}"))?;

    Ok((started, tap, ctx))
}

fn sample_kind(asbd: &cat::AudioStreamBasicDesc) -> Result<SampleKind, String> {
    let format =
        av::AudioFormat::with_asbd(asbd).ok_or_else(|| "unsupported tap asbd".to_string())?;
    match format.common_format() {
        av::audio::CommonFormat::PcmF32 => Ok(SampleKind::F32),
        av::audio::CommonFormat::PcmF64 => Ok(SampleKind::F64),
        av::audio::CommonFormat::PcmI32 => Ok(SampleKind::I32),
        av::audio::CommonFormat::PcmI16 => Ok(SampleKind::I16),
        other => Err(format!("unsupported tap sample format: {other:?}")),
    }
}

extern "C" fn proc(
    _device: ca::Device,
    _now: &cat::AudioTimeStamp,
    input_data: &cat::AudioBufList<1>,
    _input_time: &cat::AudioTimeStamp,
    _output_data: &mut cat::AudioBufList<1>,
    _output_time: &cat::AudioTimeStamp,
    ctx: Option<&mut Ctx>,
) -> os::Status {
    let Some(ctx) = ctx else {
        return os::Status::NO_ERR;
    };

    let buffer = &input_data.buffers[0];
    if buffer.data_bytes_size == 0 || buffer.data.is_null() {
        return os::Status::NO_ERR;
    }

    ctx.mono.clear();
    match ctx.kind {
        SampleKind::F32 => {
            if let Some(s) = read_samples::<f32>(buffer) {
                ctx.mono.extend_from_slice(s);
            }
        }
        SampleKind::F64 => {
            if let Some(s) = read_samples::<f64>(buffer) {
                ctx.mono.extend(s.iter().map(|&x| x as f32));
            }
        }
        SampleKind::I32 => {
            if let Some(s) = read_samples::<i32>(buffer) {
                ctx.mono
                    .extend(s.iter().map(|&x| x as f32 / i32::MAX as f32));
            }
        }
        SampleKind::I16 => {
            if let Some(s) = read_samples::<i16>(buffer) {
                ctx.mono
                    .extend(s.iter().map(|&x| x as f32 / i16::MAX as f32));
            }
        }
    }

    ctx.out.clear();
    ctx.resampler.process(&ctx.mono, &mut ctx.out);
    ctx.queue.push(&ctx.out);
    os::Status::NO_ERR
}

fn read_samples<T: Copy>(buffer: &cat::AudioBuf) -> Option<&[T]> {
    let byte_count = buffer.data_bytes_size as usize;
    if byte_count == 0 || buffer.data.is_null() {
        return None;
    }

    let data = buffer.data as *const T;
    if (data as usize) % std::mem::align_of::<T>() != 0 {
        return None;
    }

    let sample_count = byte_count / std::mem::size_of::<T>();
    if sample_count == 0 {
        return None;
    }

    Some(unsafe { std::slice::from_raw_parts(data, sample_count) })
}
