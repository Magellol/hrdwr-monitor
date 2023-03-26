import * as E from "fp-ts/Either";
import { constant, flow, pipe } from "fp-ts/function";
import * as NEA from "fp-ts/NonEmptyArray";
import * as HWiNFO from "./HWiNFO";
import * as OpenHardwareMonitor from "./OpenHardwareMonitor";
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

export const Item = t.union(
  [HWiNFO.Codec, OpenHardwareMonitor.Codec],
  "Api.Item"
);

export type Item = t.TypeOf<typeof Item>;

export const normalize = (xs: NEA.NonEmptyArray<Item>): Sensor.Sensors => {
  return pipe(
    xs,
    NEA.reduce(
      // TODO: this is a bit weird
      Sensor.Monoid.empty,
      (acc, item) => {
        const value = (() => {
          switch (item.SensorApp) {
            case "HWiNFO":
              return O.some(HWiNFO.toSensors(item));

            // TODO: how to differentiate all diffent "Load" types...
            case "Open Hardware Monitor":
              return O.none;
          }
        })();

        return pipe(value, O.getOrElse(constant(Sensor.Monoid.empty)), (x) =>
          Sensor.Monoid.concat(acc, x)
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
