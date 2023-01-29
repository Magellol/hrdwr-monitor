import { pipe } from "fp-ts/function";
import { Gauge, GaugeOptions } from "gaugeJS";
import React from "react";
import * as O from "../facades/Option";
import styles from "./VelocityGauge.css";

const gaugeOpts: GaugeOptions = {
  angle: -0.3,
  lineWidth: 0.05, // The line thickness
  radiusScale: 0.9, // Relative radius
  limitMax: true, // If false, max value increases automatically if value > maxValue
  limitMin: true, // If true, the min value of the gauge will be fixed
  pointer: {
    strokeWidth: 0,
  },
  percentColors: [
    [0.0, "#0000b3"],
    [1.0, "#9a0000"],
  ],
  highDpiSupport: true, // High resolution support
};

export type Props = {
  min: number;
  max: number;
  n: number;
  title: string;
};

export const VelocityGauge: React.FC<Props> = ({ min, max, n, title }) => {
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
