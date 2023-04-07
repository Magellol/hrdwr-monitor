#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Url;
use serde_derive::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;

#[derive(Deserialize, Serialize, Debug)]
#[serde(tag = "SensorUnit")]
enum Sensor {
    #[serde(rename = "C")]
    Temp {
        #[serde(rename = "SensorValue")]
        val: i32,
    },
    #[serde(rename = "%")]
    Load {
        #[serde(rename = "SensorValue")]
        val: i32,
    },
}

#[derive(Serialize)]
enum SensorError {
    Fetch,
    Decode,
}

#[tauri::command]
async fn get_sensor() -> Result<Vec<Sensor>, SensorError> {
    if cfg!(target_os = "macos") {
        // Note: filepath is relative to app root (where Cargo.toml lives)
        let mut file = File::open("./src/test_data.json").unwrap();
        let mut data = String::new();
        file.read_to_string(&mut data).unwrap();

        let sensors: Vec<Sensor> = serde_json::from_str(&data).expect("bad json");
        Ok(sensors)
    } else if cfg!(target_os = "windows") {
        let host = std::env::var("SENSOR_HOST").expect("Missing SENSOR_HOST env var");
        let url = Url::parse(&host).expect("Bad url");

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
