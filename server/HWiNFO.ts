import * as O from "fp-ts/Option";
import * as Sensor from "../shared/Hardware/Sensor";

import { pipe } from "fp-ts/function";
import * as t from "../shared/io-ts";

export const Codec = t.intersection(
  [
    t.type({
      SensorApp: t.literal("HWiNFO"),
      SensorClass: t.string,
      SensorUpdateTime: t.DateFromUnixTime,
      SensorValue: t.NumberFromString,
    }),
    t.type({
      SensorUnit: t.union([t.literal("C"), t.literal("F")]),
      SensorName: t.union([
        t.literal("CPU Package"),
        t.literal("GPU Temperature"),
      ]),
    }),
  ],
  "HWiNFO"
);

export type THWiNFO = t.TypeOf<typeof Codec>;

export const toSensors = (x: THWiNFO): Sensor.Sensors => {
  const value = pipe(x.SensorValue, Sensor.mkTempFromLiteral(x.SensorUnit));

  const sensors: Sensor.Sensors = (() => {
    switch (x.SensorName) {
      case "CPU Package":
        return {
          cpuLoad: O.none,
          cpuThermal: O.some(value),
          gpuThermal: O.none,
        };
      case "GPU Temperature":
        return {
          cpuLoad: O.none,
          cpuThermal: O.none,
          gpuThermal: O.some(value),
        };
    }
  })();

  return sensors;
};
