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
async fn get_sensor() -> Result<Sensor, String> {
  let url = Url::parse("http://localhost:5555")?;

  // TODO: this doesn't seem to work; mismatching types.
  let res = reqwest::get(url).await?.json::<Sensor>().await.map_err(|err| "bad error")?;
  Ok(res)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_sensor])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
