#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Url;
use serde_derive::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;

#[derive(Deserialize, Serialize, Debug)]
// TODO: this should be "readingType" prop but we can't specify integer for internal tags in serde_json
#[serde(tag = "unit")]
enum Variant {
    #[serde(rename = "°C")]
    Temp { value: f64 },
    #[serde(rename = "%")]
    Load { value: f64 },
    #[serde(other)]
    Other,
}

#[derive(Deserialize, Serialize)]
struct Sensor {
    #[serde(rename = "labelOriginal")]
    name: String,
    #[serde(flatten)]
    variant: Variant,
}

#[derive(Serialize)]
enum SensorError {
    Fetch,
    Decode(String),
    MissingSensor,
}

#[derive(Serialize)]
struct Response {
    total_cpu_load: f64,
    cpu_temp: f64,
    gpu_temp: f64,
}

#[derive(Deserialize, Serialize)]
struct HWiNfo {
    readings: Vec<Sensor>,
}

#[derive(Deserialize, Serialize)]
struct ServiceResponse {
    hwinfo: HWiNfo,
}

const CPU_LOAD_KEY: &str = "Total CPU Usage";
const GPU_TEMP_KEY: &str = "GPU Temperature";
const CPU_TEMP_KEY: &str = "CPU Package";

fn mock_sensors() -> ServiceResponse {
    // Note: filepath is relative to app root (where Cargo.toml lives)
    let mut file = File::open("./src/test_data.json").unwrap();
    let mut data = String::new();
    file.read_to_string(&mut data).unwrap();

    serde_json::from_str(&data).expect("bad json")
}

#[tauri::command]
async fn get_sensor() -> Result<Response, SensorError> {
    let resp = if cfg!(target_os = "macos") {
        mock_sensors()
    } else if cfg!(target_os = "windows") {
        // TODO: make url configurable
        let host = "http://localhost:5000/json";
        let url = Url::parse(&host).expect("Bad url");

        reqwest::get(url)
            .await
            .map_err(|_err| SensorError::Fetch)?
            .json::<ServiceResponse>()
            .await
            .map_err(|_err| SensorError::Decode(_err.to_string()))?
    } else {
        panic!("Unknown target operating system!");
    };

    let sensors: HashMap<String, Variant> = resp
        .hwinfo
        .readings
        .into_iter()
        .map(|i| (i.name, i.variant))
        .collect();

    let total_cpu_usage = sensors.get(CPU_LOAD_KEY).and_then(|x| match x {
        Variant::Load { value } => Some(value),
        _ => None,
    });
    let cpu_temp = sensors.get(CPU_TEMP_KEY).and_then(|x| match x {
        Variant::Temp { value } => Some(value),
        _ => None,
    });
    let gpu_temp = sensors.get(GPU_TEMP_KEY).and_then(|x| match x {
        Variant::Temp { value } => Some(value),
        _ => None,
    });

    total_cpu_usage
        .and_then(|total_cpu_usage_val| {
            let cpu_temp_val = cpu_temp?;
            let gpu_temp_val = gpu_temp?;

            Some(Response {
                total_cpu_load: *total_cpu_usage_val as f64,
                cpu_temp: *cpu_temp_val as f64,
                gpu_temp: *gpu_temp_val as f64,
            })
        })
        .ok_or(SensorError::MissingSensor)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_sensor])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
