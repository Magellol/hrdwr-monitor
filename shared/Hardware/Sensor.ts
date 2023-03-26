import * as Sum from "@unsplash/sum-types";
import * as M from "fp-ts/Monoid";
import * as S from "fp-ts/Semigroup";
import * as O from "fp-ts/Option";
import { TPercentage } from "../Percentage";

export type Temperature =
  | Sum.Member<"Celsius", number>
  | Sum.Member<"Fahrenheit", number>;
export const Temperature = Sum.create<Temperature>();

export type Sensors = {
  cpuThermal: O.Option<Temperature>;
  cpuLoad: O.Option<TPercentage>;
  gpuThermal: O.Option<Temperature>;
};

export const Monoid: M.Monoid<Sensors> = {
  concat: S.last<Sensors>().concat,
  empty: {
    cpuThermal: O.none,
    cpuLoad: O.none,
    gpuThermal: O.none,
  },
};

export const mkTempFromLiteral = (unit: "C" | "F") => {
  switch (unit) {
    case "C":
      return Temperature.mk.Celsius;
    case "F":
      return Temperature.mk.Fahrenheit;
  }
};
