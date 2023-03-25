import { Newtype, iso } from "newtype-ts";
import * as t from "../shared/io-ts";

export interface TPercentage
  extends Newtype<{ readonly Percentage: unique symbol }, number> {}

const { mk } = iso<TPercentage>();
export const fromNumber = mk;
export const Codec = t.fromNewtype<TPercentage>(t.number, "Percentage");
