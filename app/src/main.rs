#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use exitfailure::ExitFailure;
use reqwest::Url;
use serde_derive::{Deserialize, Serialize};

#[derive (Serialize, Deserialize, Debug)]
struct Sensor {
  SensorName: String,
}

#[tauri::command]
async fn get_sensor() -> Result<Vec<Sensor>, String> {
  let url = std::env::var("SENSOR_HOST").expect("Missing SENSOR_HOST env var");
  let url = Url::parse(&url).expect("Bad url");

  // TODO: error handling
  let res = reqwest::get(url).await.expect("Failed request").json::<Vec<Sensor>>().await.expect("not json");
  Ok(res)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_sensor])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
