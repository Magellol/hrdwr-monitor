import { ThermalGauge, Props as ThermalGaugeProps } from "../ThermalGauge";
import styles from "./Thermal.css";

type Props = {
  title: string;
  min: number;
  max: number;
};

export const Thermal: React.FC<Pick<ThermalGaugeProps, "degrees"> & Props> = ({
  degrees,
  title,
  min,
  max,
}) => {
  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
      <ThermalGauge degrees={degrees} size={175} id={title} />
      <footer className={styles.footer}>
        min: {min}°; max: {max}°
      </footer>
    </div>
  );
};
