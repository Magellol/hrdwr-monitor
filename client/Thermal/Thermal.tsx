import * as Sum from "@unsplash/sum-types";
import classNames from "classnames";
import * as A from "fp-ts/Array";
import { constant, pipe, tuple } from "fp-ts/function";
import * as NEA from "fp-ts/NonEmptyArray";
import { Gauge, GaugeOptions } from "gaugeJS";
import range from "lodash.range";
import Rainbow from "rainbowvis.js";
import React from "react";
import { toHex } from "../Color";
import * as O from "../facades/Option";
import { Props as ThermalGaugeProps, ThermalGauge } from "../ThermalGauge";
import styles from "./Thermal.css";

const [lower, upper, step] = [0, 1, 0.05];

const gaugeRainbow = new Rainbow();
gaugeRainbow.setSpectrum("#0000b3", "#9a0000");
gaugeRainbow.setNumberRange(lower, upper);

const textRainbow = new Rainbow();
textRainbow.setSpectrum("#0000b3", "#9a0000");

export type Dir = Sum.Member<"Left"> | Sum.Member<"Right">;
export const Dir = Sum.create<Dir>();

const avg5minGaugeOpts: GaugeOptions = {
  angle: 0.19,
  lineWidth: 0.02, // The line thickness
  radiusScale: 0.75, // Relative radius
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

export const Thermal: React.FC<
  Pick<ThermalGaugeProps, "paths"> & {
    label: string;
    // TODO: use newtype for percentage
    resp: O.Option<[degrees: number, load: number]>;
    model: string;
    dir: Dir;
  }
> = ({ label, model, resp, paths, dir }) => {
  // TODO: use useCallbackRef with an option instead
  const ref = React.useRef<HTMLCanvasElement>(null);
  const gaugeRef = React.useRef<O.Option<Gauge>>(O.none);

  React.useEffect(() => {
    gaugeRef.current = pipe(
      gaugeRef.current,
      O.alt(() => {
        return pipe(
          ref.current,
          O.fromNullable,
          O.map((el) => {
            const g = new Gauge(el).setOptions(avg5minGaugeOpts);
            g.maxValue = 100;
            g.setMinValue(0);
            g.animationSpeed = 150;

            return g;
          })
        );
      }),

      // TODO this sounds like `Option` is the wrong monadic context here
      O.chainFirst((g) => O.some(g.set(load)))
    );
  }, [load]);

  return (
    <div className={styles.container}>
      <header
        className={classNames(
          styles.header,
          pipe(
            dir,
            Dir.match({
              Left: constant(styles.right),
              Right: constant(styles.left),
            })
          )
        )}
      >
        <span className={styles.label}>{label}</span>
        <span className={classNames(styles.model, styles.glowyText)}>
          {model}
        </span>
      </header>
      <div className={styles.rays}>
        {pipe(
          // This can't be 90deg to avoid stacking the first and last item
          NEA.range(0, 89),
          NEA.mapWithIndex((i) => (
            <div className={styles.ray} style={{ rotate: `${4 * i}deg` }}></div>
          ))
        )}
      </div>
      <div className={classNames(styles.content)}>
        <ThermalGauge
          degrees={degrees}
          size={225}
          paths={paths}
          id={label}
          min={30}
          max={85}
        />
      </div>
      <div
        className={classNames(
          styles.loadGaugeContainer,
          pipe(
            dir,
            Dir.match({
              Left: constant(styles.left),
              Right: constant(styles.right),
            })
          )
        )}
      >
        <span className={classNames(styles.loadLabel, styles.glowyText)}>
          {load}%
        </span>
        <div className={classNames(styles.loadGraphContainer)}>
          <canvas ref={ref} style={{ width: 300, height: 300 }}></canvas>
        </div>
      </div>
    </div>
  );
};
