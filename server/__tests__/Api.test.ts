import { normalize, ResponseCodec } from "../Api";
import * as E from "fp-ts/Either";
import data from "./data";

describe("Api", () => {
  describe("normalize", () => {

    // TODO: test with actual `data`
    it("works", () => {
      const decoded = ResponseCodec.decode([
        {
          SensorApp: "HWiNFO",
          SensorClass: "CPU [#0]: Intel Core i5-13600K: DTS",
          SensorName: "P-core 0",
          SensorValue: "46",
          SensorUnit: "C",
          SensorUpdateTime: 1679766815,
        },
      ]);

      expect(decoded).toEqual(E.right(expect.any(Object)));
    });
  });
});
