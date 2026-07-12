//! Audio capture and recording (macOS only).
//!
//! Two capture sources (microphone via cpal, system audio via ScreenCaptureKit)
//! both produce 16 kHz mono i16 samples into a [`SampleQueue`]. The recorder
//! interleaves them into a stereo file (L = mic / "me", R = system / "other").

pub mod mic;
pub mod recorder;
pub mod system;

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Instant;

/// Target sample rate of the recording (Hz).
pub const TARGET_SAMPLE_RATE: u32 = 16_000;

/// True while we are recording. Used by the call detector to avoid
/// interpreting our own capture streams as "someone is on a call".
pub static RECORDING_ACTIVE: AtomicBool = AtomicBool::new(false);

/// Thread-safe growable queue of 16 kHz mono i16 samples produced by one source.
pub struct SampleQueue {
    samples: Mutex<Vec<i16>>,
    failed: AtomicBool,
    /// Milliseconds (since `created`) of the last successful push.
    last_push_ms: AtomicU64,
    created: Instant,
}

impl SampleQueue {
    pub fn new() -> Arc<Self> {
        Arc::new(Self {
            samples: Mutex::new(Vec::new()),
            failed: AtomicBool::new(false),
            last_push_ms: AtomicU64::new(0),
            created: Instant::now(),
        })
    }

    pub fn push(&self, data: &[i16]) {
        if data.is_empty() {
            return;
        }
        if let Ok(mut buf) = self.samples.lock() {
            buf.extend_from_slice(data);
        }
        self.last_push_ms
            .store(self.created.elapsed().as_millis() as u64, Ordering::Relaxed);
    }

    /// Take all currently buffered samples.
    pub fn take(&self) -> Vec<i16> {
        match self.samples.lock() {
            Ok(mut buf) => std::mem::take(&mut *buf),
            Err(_) => Vec::new(),
        }
    }

    pub fn mark_failed(&self) {
        self.failed.store(true, Ordering::Relaxed);
    }

    pub fn is_failed(&self) -> bool {
        self.failed.load(Ordering::Relaxed)
    }

    /// Milliseconds since the last push (or since creation if never pushed).
    pub fn millis_since_last_push(&self) -> u64 {
        let now = self.created.elapsed().as_millis() as u64;
        now.saturating_sub(self.last_push_ms.load(Ordering::Relaxed))
    }
}

/// Convert an f32 sample in [-1, 1] to i16 with clamping.
#[inline]
pub fn f32_to_i16(x: f32) -> i16 {
    (x.clamp(-1.0, 1.0) * i16::MAX as f32) as i16
}

/// Simple stateful linear-interpolation resampler (mono f32 in, i16 out).
///
/// Good enough for speech; keeps fractional position across callback
/// boundaries so there are no seams between audio callbacks.
pub struct Resampler {
    /// Distance between output samples, measured in input samples.
    step: f64,
    /// Position of the next output sample within [prev, cur], in input samples.
    frac: f64,
    prev: f32,
    started: bool,
}

impl Resampler {
    pub fn new(in_rate: u32, out_rate: u32) -> Self {
        Self {
            step: in_rate as f64 / out_rate as f64,
            frac: 0.0,
            prev: 0.0,
            started: false,
        }
    }

    /// Feed mono f32 input samples, appending 16 kHz i16 samples to `out`.
    pub fn process(&mut self, input: &[f32], out: &mut Vec<i16>) {
        for &cur in input {
            if !self.started {
                self.started = true;
                self.prev = cur;
                self.frac = 0.0;
                continue;
            }
            while self.frac < 1.0 {
                let s = self.prev + (cur - self.prev) * self.frac as f32;
                out.push(f32_to_i16(s));
                self.frac += self.step;
            }
            self.frac -= 1.0;
            self.prev = cur;
        }
    }
}
