#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Url;
use serde_derive::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;

#[derive(Deserialize, Serialize, Debug)]
// TODO: this should be "readingType" prop but we can't specify integer for internal tags in serde_json
#[serde(tag = "unit")]
enum Sensor {
    
    #[serde(rename = "°C")]
    Temp {
        value: f64,
        #[serde(rename = "labelOriginal")]
        name: String,
    },
    #[serde(rename = "%")]
    Load {
        value: f64,
        #[serde(rename = "labelOriginal")]
        name: String,
    },
    #[serde(rename = "RPM")]
    RPM {
        #[serde(rename = "labelOriginal")]
        name: String,
    }
}

#[derive(Serialize)]
enum SensorError {
    Fetch,
    Decode(String),
}

#[derive(Serialize)]
struct Response {
    totalCpuLoad: f64,
    cpuTemp: f64,
    gpuTemp: f64
}

#[derive(Deserialize, Serialize, Debug)]
struct HWiNfo {
    readings: Vec<Sensor>
}

#[derive(Deserialize, Serialize, Debug)]
struct RemoteResponse {
    hwinfo: HWiNfo
}

#[tauri::command]
async fn get_sensor() -> Result<Response, SensorError> {
    if cfg!(target_os = "macos") {
        // Note: filepath is relative to app root (where Cargo.toml lives)
        let mut file = File::open("./src/test_data.json").unwrap();
        let mut data = String::new();
        file.read_to_string(&mut data).unwrap();

        let _sensors: Vec<Sensor> = serde_json::from_str(&data).expect("bad json");
        Ok(Response {
            totalCpuLoad: 0.0,
            gpuTemp: 0.0,
            cpuTemp: 0.0
        })
    } else if cfg!(target_os = "windows") {
        // TODO: make url configurable
        let host = "http://localhost:5000/json";
        let url = Url::parse(&host).expect("Bad url");

        let rmtResponse = reqwest::get(url)
            .await
            .map_err(|_err| SensorError::Fetch)?
            .json::<RemoteResponse>()
            .await
            .map_err(|_err| SensorError::Decode(_err.to_string()))?;
        let mut iter = rmtResponse.hwinfo.readings.into_iter();

        let res = Response {
            // TODO: clean this up lol
            totalCpuLoad: iter.find(|x| match x {
                Sensor::Temp { name, .. } => name == "Total CPU Usage",
                Sensor::Load { name, .. } => name == "Total CPU Usage",
                Sensor::RPM { name, .. } => name == "Total CPU Usage"
            }).map(|s| match s {
                Sensor::Load { value, .. } => value,
                Sensor::Temp { value, .. } => value,
                Sensor::RPM {..}  => 0.0,
            }).unwrap_or(0.0),
            gpuTemp: 0.0,
            cpuTemp: 0.0
        };
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
