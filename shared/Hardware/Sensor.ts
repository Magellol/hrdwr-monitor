import * as Sum from "@unsplash/sum-types";
import * as M from "fp-ts/Monoid";
import * as S from "fp-ts/Semigroup";
import * as O from "fp-ts/Option";
import { TPercentage } from "../Percentage";

export type Temperature =
  | Sum.Member<"Celsius", number>
  | Sum.Member<"Fahrenheit", number>;
export const Temperature = Sum.create<Temperature>();

export type TSensor =
  | Sum.Member<"Temperature", Temperature>
  | Sum.Member<"Load", TPercentage>;
export const { mk, match, matchW } = Sum.create<TSensor>();

export type KnownSensor = "CPU Package" | "GPU Temperature";
export const KnownSensor: Array<KnownSensor> = [
  "CPU Package",
  "GPU Temperature",
];

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
