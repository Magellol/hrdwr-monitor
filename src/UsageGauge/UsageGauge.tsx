import { tuple, pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import range from "lodash.range";
import { Gauge, GaugeOptions } from "gaugeJS";
import React from "react";
import * as O from "../facades/Option";
import styles from "./UsageGauge.css";
import Rainbow from "rainbowvis.js";
import { toHex } from "../Color";

const [lower, upper, step] = [0, 1, 0.05];

const gaugeRainbow = new Rainbow();
gaugeRainbow.setSpectrum("#0000b3", "#9a0000");
gaugeRainbow.setNumberRange(lower, upper);

const gaugeOpts: GaugeOptions = {
  angle: -0.3,
  lineWidth: 0.05, // The line thickness
  radiusScale: 1, // Relative radius
  limitMax: true, // If false, max value increases automatically if value > maxValue
  limitMin: true, // If true, the min value of the gauge will be fixed
  pointer: {
    strokeWidth: 0,
  },
  percentColors: pipe(
    // We add step to the upper bound to include it as part of the range, by default it is not included.
    range(lower, upper + step, step),
    A.map((step) => tuple(step, pipe(gaugeRainbow.colorAt(step), toHex)))
  ),
  highDpiSupport: true, // High resolution support
};

export type Props = {
  min: number;
  max: number;
  n: number;
  title: string;
};

export const UsageGauge: React.FC<Props> = ({ min, max, n, title }) => {
  // TODO: use useCallbackRef with an option instead
  const ref = React.useRef(null);
  // gaugeRainbow.setNumberRange(min, max);

  React.useEffect(() => {
    const el = pipe(ref.current, O.fromNullable, O.unsafeUnwrap);

    const gauge = new Gauge(el).setOptions(gaugeOpts);
    gauge.maxValue = max; // set max gauge value
    gauge.setMinValue(min); // set min value
    gauge.set(n); // set actual value
  }, [min, max, n]);

  return (
    <div className={styles.container}>
      <canvas ref={ref} style={{ width: 175 }}></canvas>
      <span className={styles.n}>{n}</span>
      <span className={styles.title}>{title}</span>
    </div>
  );
};
