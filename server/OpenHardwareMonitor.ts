import * as t from "../shared/io-ts";
export const Codec = t.intersection(
  [
    t.type({
      SensorApp: t.literal("Open Hardware Monitor"),
      SensorName: t.string,
    }),
    t.union([
      t.type({
        SensorClass: t.literal("Temperature"),
        SensorUnit: t.union([t.literal("C"), t.literal("F")]),
      }),
      t.type({
        SensorClass: t.literal("Load"),
        SensorUnit: t.literal("%"),
      }),
      t.type({
        SensorClass: t.literal("Data"),
        SensorUnit: t.null,
      }),
    ]),
  ],
  "OpenHardwareMonitor"
);

export type TOpenHardwareMonitor = t.TypeOf<typeof Codec>;