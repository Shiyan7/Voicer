fn main() {
    tauri_build::build();

    // The `screencapturekit` crate links a Swift static library that references
    // `@rpath/libswift_Concurrency.dylib`. Without an rpath entry the bundled
    // .app aborts at launch (dyld: Library missing, no LC_RPATH's found).
    if std::env::var("CARGO_CFG_TARGET_OS").as_deref() == Ok("macos") {
        println!("cargo:rustc-link-arg=-Wl,-rpath,/usr/lib/swift");
    }
}
