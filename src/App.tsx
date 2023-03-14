import classNames from "classnames";
import "normalize.css";
import * as React from "react";
import styles from "./App.css";
import "./Globals.css";
import { Thermal, Dir } from "./Thermal";
import { pathSample1, pathSample2 } from "./ThermalGauge";
import { UsageGauge } from "./UsageGauge/UsageGauge";

// Needed data
// CPU load, CPU name, CPU temp
// RAM usage, RAM total, 
// VRAM usage, VRAM total, 
// GPU load, GPU name, GPU temp

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
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Thermal
          degrees={35}
          label="CPU Core"
          model="Intel Core i5-13600K"
          load={45}
          paths={pathSample1}
          dir={Dir.mk.Left}
        ></Thermal>

        <div className={styles.connectingLines}>
          <div className={styles.connectingLineContainer}>
            <div className={styles.leftConnectingLineContainer}>
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
                styles.usageGaugeContainer,
                styles.leftUsageGaugeContainer
              )}
            >
              <UsageGauge min={0} max={16000} n={2400} title="RAM" unit="MB" />
            </div>
          </div>
          <div className={styles.connectingLineContainer}>
            <div className={styles.rightConnectingLineContainer}>
              <div
                className={classNames(
                  styles.connectingLine,
                  styles.rightConnectingLine
                )}
              />
              <ConnectingLine />
            </div>
            <div
              className={classNames(
                styles.usageGaugeContainer,
                styles.rightUsageGaugeContainer
              )}
            >
              <UsageGauge
                min={0}
                max={24000}
                n={14000}
                title="VRAM"
                unit="MB"
              />
            </div>
          </div>
        </div>

        <Thermal
          degrees={35}
          label="GPU Core"
          model="AMD Radeon RX 7900 XTX"
          paths={pathSample2}
          load={60}
          dir={Dir.mk.Right}
        ></Thermal>
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
    </div>
  );
};
