import classNames from "classnames";
import "normalize.css";
import * as React from "react";
import styles from "./App.css";
import "./Globals.css";
import { Thermal, Dir } from "./Thermal";
import { pathSample1, pathSample2 } from "./ThermalGauge";

export const App: React.FC = () => {
  const [degrees, setDegrees] = React.useState(35);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Thermal
          degrees={degrees}
          label="CPU Core"
          model="Intel Core i5-13600K"
          paths={pathSample1}
          dir={Dir.mk.Left}
        />
        <Thermal
          degrees={degrees}
          label="GPU Core"
          model="AMD Radeon RX 7900 XTX"
          paths={pathSample2}
          dir={Dir.mk.Right}
        />
        <div className={styles.bgPattern}>
          <div
            className={classNames(
              styles.fade,
              styles.sideFade,
              styles.leftFade
            )}
          ></div>
          <div
            className={classNames(
              styles.fade,
              styles.sideFade,
              styles.rightFade
            )}
          ></div>
          <div
            className={classNames(styles.fade, styles.baseFade, styles.topFade)}
          ></div>
          <div
            className={classNames(
              styles.fade,
              styles.baseFade,
              styles.bottomFade
            )}
          ></div>
        </div>
      </div>
      <input
        value={degrees}
        type="number"
        onChange={(ev) => setDegrees(ev.target.valueAsNumber)}
      />
    </div>
  );
};
