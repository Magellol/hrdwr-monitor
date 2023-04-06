#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Url;
use serde_derive::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Sensor {
    SensorName: String,
}

#[derive(Serialize)]
enum SensorError {
    Fetch,
    Decode,
}

#[tauri::command]
async fn get_sensor() -> Result<Vec<Sensor>, SensorError> {
    if cfg!(target_os = "macos") {
        let empty: Vec<Sensor> = Vec::new();
        Ok(empty)
    } else if cfg!(target_os = "windows") {
        let url = std::env::var("SENSOR_HOST").expect("Missing SENSOR_HOST env var");
        let url = Url::parse(&url).expect("Bad url");

        let res = reqwest::get(url)
            .await
            .map_err(|_err| SensorError::Fetch)?
            .json::<Vec<Sensor>>()
            .await
            .map_err(|_err| SensorError::Decode)?;
        Ok(res)
    } else {
        panic!("Unknown target operating system!");
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_sensor])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
