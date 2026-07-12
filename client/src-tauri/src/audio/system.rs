use std::sync::Arc;

use screencapturekit::cm::CMSampleBufferExt;
use screencapturekit::shareable_content::SCShareableContent;
use screencapturekit::stream::configuration::SCStreamConfiguration;
use screencapturekit::stream::content_filter::SCContentFilter;
use screencapturekit::stream::output_type::SCStreamOutputType;
use screencapturekit::stream::sc_stream::SCStream;

use super::{f32_to_i16, SampleQueue, TARGET_SAMPLE_RATE};

pub struct SystemSource {
    stream: SCStream,
}

impl SystemSource {
    pub fn start(queue: Arc<SampleQueue>) -> Result<Self, String> {
        let content = SCShareableContent::get().map_err(|e| {
            format!("ScreenCaptureKit unavailable (screen recording permission?): {e}")
        })?;
        let displays = content.displays();
        let display = displays
            .first()
            .ok_or_else(|| "no display available for audio capture".to_string())?;

        let filter = SCContentFilter::create()
            .with_display(display)
            .with_excluding_windows(&[])
            .build();

        let config = SCStreamConfiguration::new()
            .with_captures_audio(true)
            .with_excludes_current_process_audio(true)
            .with_sample_rate(TARGET_SAMPLE_RATE as i32)
            .with_channel_count(1)
            .with_width(2)
            .with_height(2);

        let mut stream = SCStream::new(&filter, &config);

        let handler_queue = queue.clone();
        stream.add_output_handler(
            move |sample: screencapturekit::cm::CMSampleBuffer, of_type: SCStreamOutputType| {
                if of_type != SCStreamOutputType::Audio {
                    return;
                }
                let Some(list) = sample.audio_buffer_list() else {
                    return;
                };
                push_buffer_list(&handler_queue, &list);
            },
            SCStreamOutputType::Audio,
        );

        stream
            .start_capture()
            .map_err(|e| format!("failed to start system audio capture: {e}"))?;

        Ok(Self { stream })
    }

    pub fn stop(self) {
        if let Err(e) = self.stream.stop_capture() {
            eprintln!("[voicer] failed to stop system audio capture: {e}");
        }
    }
}

fn push_buffer_list(queue: &SampleQueue, list: &screencapturekit::cm::AudioBufferList) {
    let n = list.num_buffers();
    if n == 0 {
        return;
    }
    let ch0 = match list.buffer(0) {
        Some(b) => bytes_to_f32(b.data()),
        None => return,
    };
    let out: Vec<i16> = if n >= 2 {
        match list.buffer(1) {
            Some(b1) => {
                let ch1 = bytes_to_f32(b1.data());
                ch0.iter()
                    .zip(ch1.iter())
                    .map(|(&l, &r)| f32_to_i16((l + r) * 0.5))
                    .collect()
            }
            None => ch0.iter().map(|&s| f32_to_i16(s)).collect(),
        }
    } else {
        ch0.iter().map(|&s| f32_to_i16(s)).collect()
    };
    queue.push(&out);
}

fn bytes_to_f32(bytes: &[u8]) -> Vec<f32> {
    bytes
        .chunks_exact(4)
        .map(|c| f32::from_le_bytes([c[0], c[1], c[2], c[3]]))
        .collect()
}
