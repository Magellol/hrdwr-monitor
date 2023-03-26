import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { ResponseCodec } from "../Api";

describe("Api", () => {
  describe("normalize", () => {
    it("fallbacks when decoding failed", () => {
      const decoded = ResponseCodec.decode([
        {
          SensorApp: "HWiNFO",
          SensorClass: "CPU [#0]: Intel Core i5-13600K: DTS",

          // Unsupported sensor name for HWiNFO sensor app.
          SensorName: "P-core 0",
          SensorValue: "46",
          SensorUnit: "Â°C",
          SensorUpdateTime: 1679766815,
        },
      ]);

      expect(decoded).toEqual(E.right(O.none));
    });

    it("sanitizes before decoding", () => {
      const decoded = ResponseCodec.decode([
        {
          SensorApp: "HWiNFO",
          SensorClass: "CPU [#0]: Intel Core i5-13600K: DTS",
          SensorName: "CPU Package",
          SensorValue: "46",
          SensorUnit: "Â°C",
          SensorUpdateTime: 1679766815,
        },
      ]);

      expect(decoded).toEqual(E.right(expect.any(Object)));
    });
  });
});
