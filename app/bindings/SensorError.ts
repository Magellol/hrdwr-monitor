// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.

export type SensorError = { type: "Fetch" } | { type: "Decode", payload: string } | { type: "TypeMismatch", payload: string } | { type: "MissingSensor", payload: string };