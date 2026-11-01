use std::sync::atomic::Ordering;
use std::sync::mpsc::{self, Receiver, RecvTimeoutError, Sender};
use std::sync::Arc;
use std::thread::JoinHandle;
use std::time::{Duration, Instant};

use super::mic::MicSource;
use super::system::SystemSource;
use super::{SampleQueue, TeeSlot, LIVE_MIC_TEE, LIVE_SYSTEM_TEE, RECORDING_ACTIVE};

const CHUNK_INTERVAL: Duration = Duration::from_millis(100);
const RETRY_INTERVAL: Duration = Duration::from_secs(2);

pub type ChunkSink = Box<dyn Fn(Vec<u8>) + Send>;

#[derive(Clone, Copy, PartialEq, Eq)]
enum FeedKind {
    System,
    Mic,
}

enum OwnSource {
    System(SystemSource),
    Mic(MicSource),
}

impl OwnSource {
    fn start(kind: FeedKind, queue: Arc<SampleQueue>) -> Result<Self, String> {
        match kind {
            FeedKind::System => SystemSource::start(queue).map(OwnSource::System),
            FeedKind::Mic => MicSource::start(queue).map(OwnSource::Mic),
        }
    }

    fn stop(self) {
        match self {
            OwnSource::System(s) => s.stop(),
            OwnSource::Mic(s) => s.stop(),
        }
    }
}

struct Feed {
    kind: FeedKind,
    queue: Arc<SampleQueue>,
    slot: &'static TeeSlot,
    own: Option<OwnSource>,
    last_attempt: Option<Instant>,
    sink: ChunkSink,
}

impl Feed {
    fn new(kind: FeedKind, sink: ChunkSink) -> Self {
        let slot = match kind {
            FeedKind::System => &LIVE_SYSTEM_TEE,
            FeedKind::Mic => &LIVE_MIC_TEE,
        };
        let queue = SampleQueue::new();
        if let Ok(mut guard) = slot.lock() {
            *guard = Some(queue.clone());
        }
        Self {
            kind,
            queue,
            slot,
            own: None,
            last_attempt: None,
            sink,
        }
    }

    fn reconcile(&mut self) -> Result<(), String> {
        let recording = RECORDING_ACTIVE.load(Ordering::Relaxed);
        if recording {
            if let Some(own) = self.own.take() {
                own.stop();
            }
            return Ok(());
        }
        if self.own.is_some() {
            return Ok(());
        }
        if self
            .last_attempt
            .is_some_and(|at| at.elapsed() < RETRY_INTERVAL)
        {
            return Ok(());
        }
        self.last_attempt = Some(Instant::now());
        let own = OwnSource::start(self.kind, self.queue.clone())?;
        self.own = Some(own);
        Ok(())
    }

    fn flush(&self) {
        let samples = self.queue.take();
        if !samples.is_empty() {
            (self.sink)(pcm_to_le_bytes(&samples));
        }
    }

    fn shutdown(mut self) {
        if let Ok(mut guard) = self.slot.lock() {
            *guard = None;
        }
        if let Some(own) = self.own.take() {
            own.stop();
        }
        self.flush();
    }
}

pub struct LiveCapture {
    stop_tx: Sender<()>,
    join: Option<JoinHandle<()>>,
}

impl LiveCapture {
    pub fn start(on_system: ChunkSink, on_mic: Option<ChunkSink>) -> Result<Self, String> {
        let mut feeds = vec![Feed::new(FeedKind::System, on_system)];
        if let Some(sink) = on_mic {
            feeds.push(Feed::new(FeedKind::Mic, sink));
        }

        for feed in feeds.iter_mut() {
            if let Err(e) = feed.reconcile() {
                let label = match feed.kind {
                    FeedKind::System => "system audio",
                    FeedKind::Mic => "microphone",
                };
                for f in feeds {
                    f.shutdown();
                }
                return Err(format!("{label} unavailable: {e}"));
            }
        }

        let (stop_tx, stop_rx) = mpsc::channel::<()>();
        let join = std::thread::Builder::new()
            .name("voicer-live-capture".into())
            .spawn(move || live_loop(feeds, &stop_rx))
            .map_err(|e| format!("failed to spawn live thread: {e}"))?;

        Ok(Self {
            stop_tx,
            join: Some(join),
        })
    }

    pub fn stop(mut self) {
        self.shutdown();
    }

    fn shutdown(&mut self) {
        let _ = self.stop_tx.send(());
        if let Some(join) = self.join.take() {
            let _ = join.join();
        }
    }
}

impl Drop for LiveCapture {
    fn drop(&mut self) {
        self.shutdown();
    }
}

fn live_loop(mut feeds: Vec<Feed>, stop_rx: &Receiver<()>) {
    loop {
        let stop = matches!(
            stop_rx.recv_timeout(CHUNK_INTERVAL),
            Ok(()) | Err(RecvTimeoutError::Disconnected)
        );
        if stop {
            break;
        }
        for feed in feeds.iter_mut() {
            if let Err(e) = feed.reconcile() {
                eprintln!("[voicer] live capture source restart failed: {e}");
            }
            feed.flush();
        }
    }
    for feed in feeds {
        feed.shutdown();
    }
}

pub fn pcm_to_le_bytes(samples: &[i16]) -> Vec<u8> {
    let mut out = Vec::with_capacity(samples.len() * 2);
    for s in samples {
        out.extend_from_slice(&s.to_le_bytes());
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encodes_pcm_little_endian() {
        assert_eq!(
            pcm_to_le_bytes(&[1, -2, 0x1234]),
            vec![1, 0, 0xfe, 0xff, 0x34, 0x12]
        );
    }

    #[test]
    fn tee_forwards_samples() {
        static SLOT: TeeSlot = std::sync::Mutex::new(None);
        let target = SampleQueue::new();
        *SLOT.lock().unwrap() = Some(target.clone());
        let source = SampleQueue::with_tee(&SLOT);
        source.push(&[1, 2, 3]);
        assert_eq!(source.take(), vec![1, 2, 3]);
        assert_eq!(target.take(), vec![1, 2, 3]);
        *SLOT.lock().unwrap() = None;
        source.push(&[4]);
        assert!(target.take().is_empty());
    }
}
