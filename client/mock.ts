import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { Response } from "rust-bindings/Response";
import { SensorError } from "rust-bindings/SensorError";

type PartialResponse = Pick<
  Response,
  "cpu_temp" | "gpu_temp" | "total_cpu_load"
>;
const sensorDatas: Array<PartialResponse> = [
  { cpu_temp: 30, gpu_temp: 42, total_cpu_load: 8 },
  { cpu_temp: 32, gpu_temp: 48, total_cpu_load: 12 },
  { cpu_temp: 38, gpu_temp: 51, total_cpu_load: 15 },
  { cpu_temp: 40, gpu_temp: 52, total_cpu_load: 22 },
  { cpu_temp: 45, gpu_temp: 50, total_cpu_load: 30 },
  { cpu_temp: 52, gpu_temp: 50, total_cpu_load: 50 },
  { cpu_temp: 61, gpu_temp: 50, total_cpu_load: 60 },
  { cpu_temp: 60, gpu_temp: 48, total_cpu_load: 61 },
  { cpu_temp: 63, gpu_temp: 52, total_cpu_load: 68 },
  { cpu_temp: 67, gpu_temp: 50, total_cpu_load: 70 },
  { cpu_temp: 70, gpu_temp: 45, total_cpu_load: 75 },
  { cpu_temp: 71, gpu_temp: 45, total_cpu_load: 79 },
  { cpu_temp: 65, gpu_temp: 45, total_cpu_load: 72 },
  { cpu_temp: 69, gpu_temp: 42, total_cpu_load: 68 },
  { cpu_temp: 78, gpu_temp: 40, total_cpu_load: 65 },
  { cpu_temp: 61, gpu_temp: 39, total_cpu_load: 50 },
  { cpu_temp: 53, gpu_temp: 41, total_cpu_load: 43 },
  { cpu_temp: 56, gpu_temp: 42, total_cpu_load: 38 },
  { cpu_temp: 55, gpu_temp: 45, total_cpu_load: 35 },
  { cpu_temp: 50, gpu_temp: 48, total_cpu_load: 30 },
  { cpu_temp: 48, gpu_temp: 42, total_cpu_load: 28 },
  { cpu_temp: 41, gpu_temp: 42, total_cpu_load: 25 },
  { cpu_temp: 38, gpu_temp: 42, total_cpu_load: 18 },
  { cpu_temp: 33, gpu_temp: 42, total_cpu_load: 10 },
];

export const mockInvoke =
  (call: number) =>
  (command: string): Promise<unknown> => {
    switch (command) {
      case "fetch_sensor":
        const missingError: SensorError = {
          type: "MissingSensor",
          payload: "Mock sensor not found",
        };

        return pipe(
          sensorDatas,
          // Clamp `call` to the length of sensor data.
          A.lookup(call % sensorDatas.length),
          O.match(
            () => Promise.reject(missingError),
            (resp) =>
              Promise.resolve<Response>({
                ...resp,
                cpu_model: "Mock CPU",
                gpu_model: "Mock GPU",
              })
          )
        );

      default:
        throw new Error("Unhandled command");
    }
  };
