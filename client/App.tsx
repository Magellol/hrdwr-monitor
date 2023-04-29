import * as RmtData from "@devexperts/remote-data-ts";
import { invoke } from "@tauri-apps/api";
import classNames from "classnames";
import * as O from "facades/Option";
import { constant, pipe } from "fp-ts/function";
import "normalize.css";
import * as React from "react";
import { Response } from "rust-bindings/Response";
import { SensorError } from "rust-bindings/SensorError";
import styles from "./App.css";
import "./Globals.css";
import { Dir, Thermal } from "./Thermal";
import { pathSample1, pathSample2 } from "./ThermalGauge";
import { UsageGauge } from "./UsageGauge/UsageGauge";
import * as SystemStatus from "./SystemStatus";

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
      <div className={styles.content}>
        <header className={styles.status}>
          <h3 className={styles.statusHeading}>
            System status
            <SystemStatus.Dot
              state={pipe(
                state,
                RmtData.fold3(
                  constant(SystemStatus.DotState.mk.Loading),
                  constant(SystemStatus.DotState.mk.Failure),
                  constant(SystemStatus.DotState.mk.Success)
                )
              )}
            />
          </h3>
          <div className={styles.statusLabel}>
            {pipe(
              state,
              RmtData.fold3(
                () => (
                  <div className={styles.loading}>
                    Warming up <SystemStatus.Loading width={12} height={12} />
                  </div>
                ),
                (err) => (
                  <span className={styles.error}>
                    ⚠️ Failure: {mkErrorMsg(err)}
                  </span>
                ),
                () => <span className={styles.loaded}>Online</span>
              )
            )}
          </div>
        </header>
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
        <div className={styles.layout}>
          <div className={styles.thermalContainer}>
            <Thermal
              resp={pipe(
                state,
                RmtData.toOption,
                O.map((s) => ({
                  degrees: s.cpu_temp,
                  load: s.total_cpu_load,
                }))
              )}
              label="CPU Core"
              paths={pathSample1}
              dir={Dir.mk.Left}
            />
            <div
              className={classNames(styles.usageGaugeContainer, styles.left)}
            >
              <UsageGauge
                min={0}
                max={100}
                n={pipe(
                  state,
                  RmtData.toOption,
                  O.map((s) => s.total_ram_load),
                  O.getOrElse(constant(0))
                )}
                title="RAM"
              />
            </div>
          </div>

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
            </div>
          </div>

          <div className={styles.thermalContainer}>
            <div
              className={classNames(styles.usageGaugeContainer, styles.right)}
            >
              <UsageGauge
                min={0}
                max={100}
                n={pipe(
                  state,
                  RmtData.toOption,
                  O.map((s) => s.total_vram_load),
                  O.getOrElse(constant(0))
                )}
                title="VRAM"
              />
            </div>
            <Thermal
              resp={pipe(
                state,
                RmtData.toOption,
                O.map((s) => ({
                  degrees: s.gpu_temp,
                  load: s.total_gpu_load,
                }))
              )}
              label="GPU Core"
              paths={pathSample2}
              dir={Dir.mk.Right}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
