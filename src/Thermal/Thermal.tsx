import classNames from "classnames";
import { Props as ThermalGaugeProps, ThermalGauge } from "../ThermalGauge";
import styles from "./Thermal.css";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";

export const Thermal: React.FC<
  Pick<ThermalGaugeProps, "degrees" | "paths"> & { label: string }
> = ({ label, degrees, paths }) => {
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
    </div>
  );
};
