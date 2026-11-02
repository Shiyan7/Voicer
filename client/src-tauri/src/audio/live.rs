use std::sync::atomic::Ordering;
use std::sync::mpsc::{self, Receiver, RecvTimeoutError, Sender};
use std::sync::Arc;
use std::thread::JoinHandle;
use std::time::{Duration, Instant};

use super::system::SystemSource;
use super::{SampleQueue, LIVE_FEED_ACTIVE, LIVE_SYSTEM_QUEUE};

const CHUNK_INTERVAL: Duration = Duration::from_millis(100);
const RETRY_INTERVAL: Duration = Duration::from_secs(2);

pub type ChunkSink = Box<dyn Fn(Vec<u8>) -> bool + Send>;

struct Feed {
    queue: Arc<SampleQueue>,
    own: Option<SystemSource>,
    last_attempt: Option<Instant>,
    sink: ChunkSink,
}

impl Feed {
    fn new(sink: ChunkSink) -> Self {
        let queue = SampleQueue::new();
        if let Ok(mut slot) = LIVE_SYSTEM_QUEUE.lock() {
            *slot = Some(queue.clone());
        }
        Self {
            queue,
            own: None,
            last_attempt: None,
            sink,
        }
    }

    fn reconcile(&mut self) -> Result<(), String> {
        if LIVE_FEED_ACTIVE.load(Ordering::Relaxed) {
            self.own = None;
            return Ok(());
        }
        if self.own.is_some()
            || self
                .last_attempt
                .is_some_and(|at| at.elapsed() < RETRY_INTERVAL)
        {
            return Ok(());
        }
        self.last_attempt = Some(Instant::now());
        self.own = Some(SystemSource::start(self.queue.clone())?);
        Ok(())
    }

    fn flush(&self) -> bool {
        let samples = self.queue.take();
        samples.is_empty() || (self.sink)(pcm_to_le_bytes(&samples))
    }
}

impl Drop for Feed {
    fn drop(&mut self) {
        if let Ok(mut slot) = LIVE_SYSTEM_QUEUE.lock() {
            *slot = None;
        }
        self.own = None;
        self.flush();
    }
}

pub struct LiveCapture {
    stop_tx: Sender<()>,
    join: Option<JoinHandle<()>>,
}

impl LiveCapture {
    pub fn start(on_system: ChunkSink) -> Result<Self, String> {
        let mut feed = Feed::new(on_system);
        feed.reconcile()
            .map_err(|e| format!("system audio unavailable: {e}"))?;

        let (stop_tx, stop_rx) = mpsc::channel::<()>();
        let join = std::thread::Builder::new()
            .name("voicer-live-capture".into())
            .spawn(move || live_loop(feed, &stop_rx))
            .map_err(|e| format!("failed to spawn live thread: {e}"))?;

        Ok(Self {
            stop_tx,
            join: Some(join),
        })
    }
}

impl Drop for LiveCapture {
    fn drop(&mut self) {
        let _ = self.stop_tx.send(());
        if let Some(join) = self.join.take() {
            let _ = join.join();
        }
    }
}

fn live_loop(mut feed: Feed, stop_rx: &Receiver<()>) {
    loop {
        if !matches!(
            stop_rx.recv_timeout(CHUNK_INTERVAL),
            Err(RecvTimeoutError::Timeout)
        ) {
            break;
        }
        if let Err(e) = feed.reconcile() {
            eprintln!("[voicer] live capture source restart failed: {e}");
        }
        if !feed.flush() {
            break;
        }
    }
}

fn pcm_to_le_bytes(samples: &[i16]) -> Vec<u8> {
    samples.iter().flat_map(|s| s.to_le_bytes()).collect()
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
}
