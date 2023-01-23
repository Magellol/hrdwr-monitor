import { ThermalGauge, Props as ThermalGaugeProps } from "../ThermalGauge";
import styles from "./Thermal.css";

type Props = {
  title: string;
};

export const Thermal: React.FC<Pick<ThermalGaugeProps, "degrees"> & Props> = ({
  degrees,
  title,
}) => {
  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
      <ThermalGauge degrees={degrees} size={175} id={title} />
    </div>
  );
};
