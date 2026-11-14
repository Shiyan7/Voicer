use std::sync::mpsc;
use std::time::Duration;

use cidre::{blocks, cf, cg, ns, sc};

const TIMEOUT: Duration = Duration::from_secs(5);
const MAX_WIDTH: usize = 1920;
const JPEG_QUALITY: f64 = 0.6;

pub fn capture_main_display_jpeg() -> Result<Vec<u8>, String> {
    let (tx, rx) = mpsc::channel::<Result<Vec<u8>, String>>();

    let mut content_block =
        blocks::ResultCh::<sc::ShareableContent>::new2(move |content, error| {
            let tx = tx.clone();
            let Some(content) = content else {
                let _ = tx.send(Err(ns_error_msg("shareable content", error)));
                return;
            };
            let displays = content.displays();
            let main_id = cg::DirectDisplayId::main();
            let display = (0..displays.len())
                .map(|i| displays.get(i))
                .filter_map(Result::ok)
                .find(|d| d.display_id() == main_id)
                .or_else(|| displays.get(0).ok());
            let Some(display) = display else {
                let _ = tx.send(Err("no display available".into()));
                return;
            };

            let own_pid = std::process::id() as i32;
            let all_apps = content.apps();
            let own_apps: Vec<_> = (0..all_apps.len())
                .filter_map(|i| all_apps.get(i).ok())
                .filter(|app| app.process_id() == own_pid)
                .map(|app| app.retained())
                .collect();
            let filter = sc::ContentFilter::with_display_excluding_apps_excepting_windows(
                &display,
                &ns::Array::from_slice_retained(&own_apps),
                &ns::Array::new(),
            );
            let mut cfg = sc::StreamCfg::new();
            let (width, height) = fit_width(display.width(), display.height());
            cfg.set_width(width);
            cfg.set_height(height);
            cfg.set_shows_cursor(false);

            let mut image_block = blocks::ResultCh::<cg::Image>::new2(move |image, error| {
                let res = match image {
                    Some(image) => encode_jpeg(image),
                    None => Err(ns_error_msg("capture image", error)),
                };
                let _ = tx.send(res);
            });
            sc::ScreenshotManager::capture_image_ch(&filter, &cfg, Some(&mut image_block));
        });
    sc::ShareableContent::current_with_ch_block(&mut content_block);

    rx.recv_timeout(TIMEOUT)
        .map_err(|_| "screenshot timed out".to_string())?
}

fn fit_width(width: isize, height: isize) -> (usize, usize) {
    let width = width.max(1) as usize;
    let height = height.max(1) as usize;
    if width <= MAX_WIDTH {
        return (width, height);
    }
    (MAX_WIDTH, (height * MAX_WIDTH / width).max(1))
}

fn encode_jpeg(image: &cg::Image) -> Result<Vec<u8>, String> {
    let mut data = cf::DataMut::with_capacity(0);
    let ty = cf::String::from_str("public.jpeg");
    let mut dst =
        cg::ImageDst::with_data(&mut data, &ty, 1).ok_or("jpeg destination unavailable")?;
    let quality = cf::Number::from_f64(JPEG_QUALITY);
    let key: &cg::image::destination::AddOptKey =
        unsafe { std::mem::transmute(cg::image::destination::OptKey::lossy_compression_quality()) };
    let options = cf::DictionaryOf::with_keys_values(&[key], &[quality.as_type_ref()]);
    dst.add_image(image, Some(&options));
    if !dst.finalize() {
        return Err("jpeg encode failed".into());
    }
    Ok(data.as_slice().to_vec())
}

fn ns_error_msg(what: &str, error: Option<&ns::Error>) -> String {
    match error {
        Some(e) => format!("{what}: {e:?}"),
        None => format!("{what} failed"),
    }
}
