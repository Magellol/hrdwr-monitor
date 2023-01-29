import classNames from "classnames";
import { Props as ThermalGaugeProps, ThermalGauge } from "../ThermalGauge";
import styles from "./Thermal.css";

type Props = {
  title: string;
};

export const Thermal: React.FC<Pick<ThermalGaugeProps, "degrees"> & Props> = ({
  degrees,
  title,
}) => {
  return (
    <div className={styles.container}>
      <div className={classNames(styles.content)}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
        <ThermalGauge
          degrees={degrees}
          size={175}
          id={title}
          min={30}
          max={85}
        />
      </div>
    </div>
  );
};
