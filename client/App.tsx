import classNames from "classnames";
import "normalize.css";
import * as React from "react";
import styles from "./App.css";
import "./Globals.css";
import { Dir, Thermal } from "./Thermal";
import { pathSample1, pathSample2 } from "./ThermalGauge";
import { UsageGauge } from "./UsageGauge/UsageGauge";
import { invoke } from '@tauri-apps/api';

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

type State = {
  totalCpuLoad: number;
  cpuTemp: number;
  gpuTemp: number;
};

export const App: React.FC = () => {
  const [state, setState] = React.useState<State>({
    totalCpuLoad: 0,
    cpuTemp: 0,
    gpuTemp: 0,
  });

  React.useEffect(() => {
    const id = window.setInterval(() => {
      // TODO: Decode? I think we can trust what rust outputs
      invoke('get_sensor').then(response => setState(response), err => {
        console.error("Error", err)
      });
    }, 2000);

    return () => {
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Thermal
          degrees={state.cpuTemp}
          load={state.totalCpuLoad}
          label="CPU Core"
          model="Intel Core i5-13600K"
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
              <UsageGauge
                // TODO: we have to use -1 here because max must be greater than min and they both start at 0 on the first render
                // we can use options instead.
                min={-1}

                // TODO: we should set this once and for all when the load the app
                // We could request when we boot the app at the beginning and never change this info ever again.
                max={16000}
                n={0}
                title="RAM"
                unit="MB"
              />
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
              <UsageGauge min={0} max={24000} n={0} title="VRAM" unit="MB" />
            </div>
          </div>
        </div>

        <Thermal
          degrees={state.gpuTemp}
          label="GPU Core"
          model="AMD Radeon RX 7900 XTX"
          paths={pathSample2}
          load={0}
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
