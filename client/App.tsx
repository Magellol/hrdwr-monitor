import * as RmtData from "@devexperts/remote-data-ts";
import { invoke } from "@tauri-apps/api";
import classNames from "classnames";
import * as O from "fp-ts/Option";
import { pipe, tuple } from "fp-ts/function";
import "normalize.css";
import * as React from "react";
import { Response } from "rust-bindings/Response";
import { SensorError } from "rust-bindings/SensorError";
import styles from "./App.css";
import "./Globals.css";
import { Dir, Thermal } from "./Thermal";
import { pathSample1, pathSample2 } from "./ThermalGauge";
import { UsageGauge } from "./UsageGauge/UsageGauge";

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

const mkErrorMsg = (error: Error | SensorError): string => {
  if (error instanceof Error) {
    return error.message;
  } else {
    switch (error.type) {
      case "Fetch":
        return "Failed to fetch the remote server. Make sure it is running as instructed in the readme.";
      case "Decode":
      case "MissingSensor":
        return `Sensor ${error.payload} was not found in the remote server. Make sure it is being tracked by HMWiNfo as instructed in the readme.`;
      case "TypeMismatch":
        return `Sensor ${error.payload} did not have the expected type. This may be a bug in this application and should be reported.`;
    }
  }
};

type AppError = Error | SensorError;

export const App: React.FC = () => {
  const [state, setState] = React.useState<
    RmtData.RemoteData<AppError, Response>
  >(RmtData.initial);

  React.useEffect(() => {
    setState(RmtData.pending);

    const id = window.setInterval(() => {
      // Since we own the rust backend, for now we're going to trust the data being sent to avoid any further decoding process.
      invoke<Response>("fetch_sensor").then(
        (resp) => setState(RmtData.success(resp)),
        (err: Error | SensorError) => setState(RmtData.failure(err))
      );
    }, 2000);

    return () => {
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Thermal
          resp={pipe(
            state,
            RmtData.toOption,
            O.map((s) => tuple(s.cpu_temp, 0))
          )}
          label="CPU Core"
          model={pipe(
            state,
            RmtData.toOption,
            O.map((s) => s.cpu_model)
          )}
          paths={pathSample1}
          dir={Dir.mk.Left}
        />

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
          resp={pipe(
            state,
            RmtData.toOption,
            O.map((s) => tuple(s.gpu_temp, 0))
          )}
          label="GPU Core"
          model={pipe(
            state,
            RmtData.toOption,
            O.map((s) => s.gpu_model)
          )}
          paths={pathSample2}
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
