import classNames from "classnames";
import {
  Props as ThermalGaugeProps,
  ThermalGauge
} from "../ThermalGauge";
import styles from "./Thermal.css";

export const Thermal: React.FC<
  Pick<ThermalGaugeProps, "degrees" | "paths"> & { id: string }
> = ({ id, degrees, paths }) => {
  return (
    <div className={styles.container}>
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
          id={id}
          min={30}
          max={85}
        />
      </div>
    </div>
  );
};
