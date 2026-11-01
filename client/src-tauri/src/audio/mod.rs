pub mod live;
pub mod mic;
pub mod recorder;
pub mod screenshot;
pub mod system;

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Instant;

pub const TARGET_SAMPLE_RATE: u32 = 16_000;

pub static RECORDING_ACTIVE: AtomicBool = AtomicBool::new(false);

pub type TeeSlot = Mutex<Option<Arc<SampleQueue>>>;

pub static LIVE_SYSTEM_TEE: TeeSlot = Mutex::new(None);

pub struct SampleQueue {
    samples: Mutex<Vec<i16>>,
    failed: AtomicBool,
    last_push_ms: AtomicU64,
    created: Instant,
    tee: Option<&'static TeeSlot>,
}

impl SampleQueue {
    pub fn new() -> Arc<Self> {
        Self::build(None)
    }

    pub fn with_tee(tee: &'static TeeSlot) -> Arc<Self> {
        Self::build(Some(tee))
    }

    fn build(tee: Option<&'static TeeSlot>) -> Arc<Self> {
        Arc::new(Self {
            samples: Mutex::new(Vec::new()),
            failed: AtomicBool::new(false),
            last_push_ms: AtomicU64::new(0),
            created: Instant::now(),
            tee,
        })
    }

    pub fn push(&self, data: &[i16]) {
        if data.is_empty() {
            return;
        }
        if let Ok(mut buf) = self.samples.lock() {
            buf.extend_from_slice(data);
        }
        if let Some(slot) = self.tee {
            if let Ok(guard) = slot.try_lock() {
                if let Some(target) = guard.as_ref() {
                    target.push(data);
                }
            }
        }
        self.last_push_ms
            .store(self.created.elapsed().as_millis() as u64, Ordering::Relaxed);
    }

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

    pub fn millis_since_last_push(&self) -> u64 {
        let now = self.created.elapsed().as_millis() as u64;
        now.saturating_sub(self.last_push_ms.load(Ordering::Relaxed))
    }
}

#[inline]
pub fn f32_to_i16(x: f32) -> i16 {
    (x.clamp(-1.0, 1.0) * i16::MAX as f32) as i16
}

pub struct Resampler {
    step: f64,
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
