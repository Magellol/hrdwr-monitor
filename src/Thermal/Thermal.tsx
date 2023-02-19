import classNames from "classnames";
import { Props as ThermalGaugeProps, ThermalGauge } from "../ThermalGauge";
import styles from "./Thermal.css";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe, tuple } from "fp-ts/function";
import * as A from "fp-ts/Array";
import range from "lodash.range";
import { GaugeOptions, Gauge } from "gaugeJS";
import { toHex } from "../Color";
import Rainbow from "rainbowvis.js";
import React from "react";
import * as O from "../facades/Option";

const [lower, upper, step] = [0, 1, 0.05];

const gaugeRainbow = new Rainbow();
gaugeRainbow.setSpectrum("#0000b3", "#9a0000");
gaugeRainbow.setNumberRange(lower, upper);

const textRainbow = new Rainbow();
textRainbow.setSpectrum("#0000b3", "#9a0000");

const avg5minGaugeOpts: GaugeOptions = {
  angle: 0.19,
  lineWidth: 0.02, // The line thickness
  radiusScale: 0.75, // Relative radius
  limitMax: true, // If false, max value increases automatically if value > maxValue
  limitMin: true, // If true, the min value of the gauge will be fixed
  pointer: {
    strokeWidth: 0,
  },
  strokeColor: "black",
  percentColors: pipe(
    // We add step to the upper bound to include it as part of the range, by default it is not included.
    range(lower, upper + step, step),
    A.map((step) => tuple(step, pipe(gaugeRainbow.colorAt(step), toHex)))
  ),
  highDpiSupport: true, // High resolution support
};

export const Thermal: React.FC<
  Pick<ThermalGaugeProps, "degrees" | "paths"> & { label: string }
> = ({ label, degrees, paths }) => {
  const min = 30;
  const max = 85;
  // TODO: use useCallbackRef with an option instead
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = pipe(ref.current, O.fromNullable, O.unsafeUnwrap);

    // TODO there is a bug where the gauge glitches when the number is updated. It starts the animation from zero all over againb
    // My guess is because the `gauge` and its `min` `max` are not preserved and re-created everytime the degrees update.
    const gauge = new Gauge(el).setOptions(avg5minGaugeOpts);
    gauge.maxValue = max; // set max gauge value
    gauge.setMinValue(min); // set min value

    // TODO: this should be the avg over time (e.g 5 minutes) as opposed to be the the current value
    gauge.set(degrees);
    // gauge.animationSpeed = 150;
  }, [min, max, degrees]);

  return (
    <div className={styles.container}>
      <header>
        <span className={styles.label}>{label}</span>
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
      <div className={styles.avgGaugeContainer}>
        <canvas ref={ref} style={{ width: 300, height: 300 }}></canvas>
      </div>
    </div>
  );
};
