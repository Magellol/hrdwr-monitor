#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Url;
use serde_derive::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;
use std::collections::HashMap;

#[derive(Deserialize, Serialize, Debug)]
// TODO: this should be "readingType" prop but we can't specify integer for internal tags in serde_json
#[serde(tag = "unit")]
enum Variant {
    
    #[serde(rename = "°C")]
    Temp {
        value: f64,
    },
    #[serde(rename = "%")]
    Load {
        value: f64,
    },
    #[serde(other)]
    Other
}

#[derive(Deserialize, Serialize)]
struct Sensor {
    #[serde(rename = "labelOriginal")]
    name: String,
    #[serde(flatten)]
    variant: Variant
}

#[derive(Serialize)]
enum SensorError {
    Fetch,
    Decode(String),
    MissingSensor
}

#[derive(Serialize)]
struct Response {
    totalCpuLoad: f64,
    cpuTemp: f64,
    gpuTemp: f64
}

#[derive(Deserialize, Serialize)]
struct HWiNfo {
    readings: Vec<Sensor>
}

#[derive(Deserialize, Serialize)]
struct RemoteResponse {
    hwinfo: HWiNfo
}

const CPU_LOAD_KEY: &str ="Total CPU Usage";
const GPU_TEMP_KEY: &str = "GPU Temperature";
const CPU_TEMP_KEY: &str = "CPU Package";

#[tauri::command]
async fn get_sensor() -> Result<Response, SensorError> {
    if cfg!(target_os = "macos") {
        // Note: filepath is relative to app root (where Cargo.toml lives)
        let mut file = File::open("./src/test_data.json").unwrap();
        let mut data = String::new();
        file.read_to_string(&mut data).unwrap();

        let _sensors: Vec<Sensor> = serde_json::from_str(&data).expect("bad json");

        // TODO: fill this up
        Ok(Response {
            totalCpuLoad: 0.0,
            cpuTemp: 0.0,
            gpuTemp: 0.0
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

        let sensors: HashMap<String, Variant> = rmtResponse.hwinfo.readings.into_iter().map(|i| (i.name, i.variant)).collect();
        let total_cpu_usage = sensors.get(CPU_LOAD_KEY).and_then(|x| match x {
            Variant::Load { value } => Some(value),
            _ => None
        });
        let cpu_temp = sensors.get(CPU_TEMP_KEY).and_then(|x| match x {
            Variant::Temp {value} => Some(value),
            _ => None
        });
        let gpu_temp = sensors.get(GPU_TEMP_KEY).and_then((|x| match x {
            Variant::Temp {value} => Some(value),
            _ => None
        }));

        let result = total_cpu_usage.and_then(|total_cpu_usage_val| {
            let cpu_temp_val = cpu_temp?;
            let gpu_temp_val = gpu_temp?;

            Some(Response {
                totalCpuLoad: *total_cpu_usage_val as f64,
                cpuTemp: *cpu_temp_val as f64,
                gpuTemp: *gpu_temp_val as f64
            })
        }).ok_or(SensorError::MissingSensor);

        result
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
