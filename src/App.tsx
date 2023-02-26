import classNames from "classnames";
import "normalize.css";
import * as React from "react";
import styles from "./App.css";
import "./Globals.css";
import { Thermal, Dir } from "./Thermal";
import { pathSample1, pathSample2 } from "./ThermalGauge";

const ConnectingLine: React.FC = () => {
  const id = React.useId();
  return (
    <svg
      width="222"
      height="37"
      viewBox="0 0 222 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id}>
          <stop stopColor="transparent" offset="0%" />
          <stop stopColor="white" offset="30%" />
        </linearGradient>
      </defs>
      {/* Note: this has to closely related to the same path in the`styles.connectingLine svg path */}
      <path
        stroke={`url(#${id})`}
        d="M0 1H186.161L221 36"
        className={styles.connectingLinePath}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export const App: React.FC = () => {
  const [degrees, setDegrees] = React.useState(35);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Thermal
          degrees={degrees}
          label="CPU Core"
          model="Intel Core i5-13600K"
          load={45}
          paths={pathSample1}
          dir={Dir.mk.Left}
        />
        <div className={styles.connectingLines}>
          <div
            className={classNames(
              styles.connectingLineContainer,
              styles.leftConnectingLineContainer
            )}
          >
            <div
              className={classNames(
                styles.connectingLine,
                styles.leftConnectingLine
              )}
            />
            <ConnectingLine />
          </div>
          <div
            className={classNames(
              styles.connectingLineContainer,
              styles.rightConnectingLineContainer
            )}
          >
            <div
              className={classNames(
                styles.connectingLine,
                styles.rightConnectingLine
              )}
            />
            <ConnectingLine />
          </div>
        </div>

        <Thermal
          degrees={degrees}
          label="GPU Core"
          model="AMD Radeon RX 7900 XTX"
          paths={pathSample2}
          load={60}
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
