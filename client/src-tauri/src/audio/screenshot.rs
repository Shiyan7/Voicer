use std::sync::mpsc;
use std::time::Duration;

use cidre::{blocks, cf, cg, ns, sc};

const TIMEOUT: Duration = Duration::from_secs(5);

pub fn capture_main_display_png() -> Result<Vec<u8>, String> {
    let (tx, rx) = mpsc::channel::<Result<Vec<u8>, String>>();

    let mut content_block =
        blocks::ResultCh::<sc::ShareableContent>::new2(move |content, error| {
            let tx = tx.clone();
            let Some(content) = content else {
                let msg = error
                    .map(|e| format!("shareable content: {e:?}"))
                    .unwrap_or_else(|| "shareable content unavailable".into());
                let _ = tx.send(Err(msg));
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

            let filter =
                sc::ContentFilter::with_display_excluding_windows(&display, &ns::Array::new());
            let mut cfg = sc::StreamCfg::new();
            cfg.set_width(display.width().max(1) as usize);
            cfg.set_height(display.height().max(1) as usize);
            cfg.set_shows_cursor(false);

            let mut image_block = blocks::ResultCh::<cg::Image>::new2(move |image, error| {
                let res = match image {
                    Some(image) => encode_png(image),
                    None => Err(error
                        .map(|e| format!("capture image: {e:?}"))
                        .unwrap_or_else(|| "capture image failed".into())),
                };
                let _ = tx.send(res);
            });
            sc::ScreenshotManager::capture_image_ch(&filter, &cfg, Some(&mut image_block));
        });
    sc::ShareableContent::current_with_ch_block(&mut content_block);

    rx.recv_timeout(TIMEOUT)
        .map_err(|_| "screenshot timed out (screen recording permission?)".to_string())?
}

fn encode_png(image: &cg::Image) -> Result<Vec<u8>, String> {
    let mut data = cf::DataMut::with_capacity(0);
    let ty = cf::String::from_str("public.png");
    let mut dst =
        cg::ImageDst::with_data(&mut data, &ty, 1).ok_or("png destination unavailable")?;
    dst.add_image(image, None);
    if !dst.finalize() {
        return Err("png encode failed".into());
    }
    Ok(data.as_slice().to_vec())
}
