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

const textRainbow = new Rainbow();
textRainbow.setSpectrum("#0000b3", "#9a0000");

const gaugeOpts: GaugeOptions = {
  angle: -0.3,
  lineWidth: 0.05, // The line thickness
  radiusScale: 1, // Relative radius
  limitMax: true, // If false, max value increases automatically if value > maxValue
  limitMin: true, // If true, the min value of the gauge will be fixed
  pointer: {
    strokeWidth: 0,
  },
  strokeColor: "rgba(255, 255, 255, 0.03)",
  percentColors: pipe(
    // We add step to the upper bound to include it as part of the range, by default it is not included.
    range(lower, upper + step, step),
    A.map((step) => tuple(step, pipe(gaugeRainbow.colorAt(step), toHex)))
  ),
  highDpiSupport: true, // High resolution support
  renderTicks: {
    divisions: 3,
    divWidth: 1,
    divLength: 2,
    subDivisions: 2,
    subWidth: 1,
    subLength: 1,
    subColor: "rgba(255, 255, 255, 0.15)",
    divColor: "rgba(255, 255, 255, 0.2)",
  },
};

export type Props = {
  min: number;
  max: number;
  n: number;
  title: string;
};

export const UsageGauge: React.FC<Props> = ({ min, max, n, title }) => {
  textRainbow.setNumberRange(min, max);

  // TODO: use useCallbackRef with an option instead
  const ref = React.useRef(null);
  const gaugeRef = React.useRef<O.Option<Gauge>>(O.none);

  React.useEffect(() => {
    gaugeRef.current = pipe(
      gaugeRef.current,
      O.alt(() => {
        return pipe(
          ref.current,
          O.fromNullable,
          O.map((el) => {
            const g = new Gauge(el).setOptions(gaugeOpts);
            g.maxValue = max; // set max gauge value
            g.setMinValue(min); // set min value
            g.animationSpeed = 50;
            g.set(0);

            return g;
          })
        );
      }),

      // TODO this sounds like `Option` is the wrong monadic context here
      O.chainFirst((g) => O.some(g.set(n)))
    );
  }, [min, max, n]);

  return (
    <div className={styles.container}>
      <canvas ref={ref} style={{ width: 100, height: 100 }}></canvas>
      <div className={styles.nContainer}>
        <span
          style={{
            textShadow: `0 0 0.3em ${pipe(
              textRainbow.colorAt(n),
              toHex
            )}, 0 0 0.6em ${pipe(textRainbow.colorAt(n + 1), toHex)}`,
          }}
        >
          {Intl.NumberFormat("en-CA", {
            style: "percent",
            maximumFractionDigits: 1,
          }).format(n / max)}
        </span>
      </div>
      <span className={styles.title}>{title}</span>
    </div>
  );
};
