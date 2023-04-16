import { Response } from "rust-bindings/Response";

export const mockInvoke = async (command: string) => {
  switch (command) {
    case "fetch_sensor":
      const resp: Response = {
        cpu_model: "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
        cpu_temp: 60,
        gpu_model: "Intel(R) UHD Graphics 630",
        gpu_temp: 60,
        total_cpu_load: 0.5,
      };
      return resp;
    default:
      throw new Error("Unhandled command");
  }
};
