import * as E from "fp-ts/Either";
import { constant, flow, pipe } from "fp-ts/function";
import * as NEA from "fp-ts/NonEmptyArray";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import fetch from "node-fetch";
import * as Sensor from "../shared/Hardware/Sensor";
import * as t from "../shared/io-ts";
import * as Sum from "../shared/sum-types";

type ApiError =
  | Sum.Member<"Fetch", string>
  | Sum.Member<"BadJson">
  | Sum.Member<"Decode", t.Errors>
  | Sum.Member<"Unknown", string>;
const ApiError = Sum.create<ApiError>();

const CommonClass = t.type({
  SensorUpdateTime: t.DateFromUnixTime,
  SensorName: t.string,
  SensorValue: t.NumberFromString,
});

const HWiNFOClass = t.type(
  {
    SensorApp: t.literal("HWiNFO"),
    SensorUnit: t.union([
      t.literal("C"),
      t.literal("F"),
      t.literal("%"),
      t.literal("RPM"),
    ]),
    SensorClass: t.string,
  },
  "Api.HWiNFOClass"
);

const OpenHardwareMonitorClass = t.intersection(
  [
    t.type({
      SensorApp: t.literal("Open Hardware Monitor"),
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
  "Api.OpenHardwareMonitorClass"
);

export const Item = t.intersection(
  [CommonClass, t.union([HWiNFOClass, OpenHardwareMonitorClass])],
  "Api.Item"
);

export type Item = t.TypeOf<typeof Item>;

export const normalize = (xs: NEA.NonEmptyArray<Item>): Sensor.Sensors => {
  return pipe(
    xs,
    NEA.reduce(
      {
        cpuThermal: O.none,
        cpuLoad: O.none,
        gpuThermal: O.none,
      },
      (acc, item) => {
        const value = (() => {
          /**
           * TODO:
           * This is actually unsafe because it's making too many assumption that may not be true based on the codec definition.
           * e.g the codec would allow `CPU PAckage` to be a load sensor for instance and this would result in a bug.
           * For the sake of making some progress on this, I'm going to live with this assumption but ideally we should offload
           * this to the codec and fix the `Item` codec to decode with the right combinations.
           */
          switch (item.SensorName) {
            case "CPU Package":
              return pipe(
                item.SensorValue,
                // TODO: this assumes thatt the unit is always Celsius but can also be fahrenheit
                Sensor.Temperature.mk.Celsius,
                Sensor.mk.Temperature,
                O.some
              );
            case "GPU Temperature":
              return pipe(
                item.SensorValue,
                Sensor.Temperature.mk.Celsius,
                Sensor.mk.Temperature,
                O.some
              );

            default:
              return O.none;
          }
        })();

        return pipe(
          value,
          O.match(constant(acc), (sensor) => ({
            ...acc,
            [item.SensorName]: O.some(sensor),
          }))
        );
      }
    )
  );
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

export const ResponseCodec = t.nonEmptyArray(Item);

export const request = (
  ...params: Parameters<typeof fetch>
): TE.TaskEither<ApiError, Sensor.Sensors> =>
  pipe(
    TE.tryCatch(
      () => fetch(...params),
      flow(getErrorMessage, ApiError.mk.Fetch)
    ),
    TE.chain((response) =>
      TE.tryCatch(() => response.json(), constant(ApiError.mk.BadJson))
    ),
    TE.chainEitherK(flow(ResponseCodec.decode, E.mapLeft(ApiError.mk.Decode))),
    TE.map(normalize)
  );
