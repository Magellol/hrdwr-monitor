import "normalize.css";
import "./Globals.css";
import * as O from "fp-ts/Option";
import * as Sum from "@unsplash/sum-types";
import * as React from "react";
import { Thermal } from "./Thermal";
import { Block } from "./Block";
import styles from "./App.css";
import { constant, constNull, flow, pipe } from "fp-ts/es6/function";
import classNames from "classnames";

type Status = Sum.Member<"OK"> | Sum.Member<"Warning"> | Sum.Member<"Critical">;
const Status = Sum.create<Status>();

const cpuMin = 30;
const cpuMax = 70;

const gpuMin = 40;
const gpuMax = 80;

export const App: React.FC = () => {
  const [status, setStatus] = React.useState<O.Option<Status>>(O.none);
  const [degrees, setDegrees] = React.useState(30);

  React.useEffect(() => {
    if (degrees <= cpuMax) {
      setStatus(O.some(Status.mk.OK));
    } else if (degrees > cpuMax && degrees < cpuMax + 25) {
      setStatus(O.some(Status.mk.Warning));
    } else {
      setStatus(O.some(Status.mk.Critical));
    }
  }, [degrees]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.statusContainer}>
          {pipe(
            status,
            O.map(
              flow(
                Status.match<[string, string]>({
                  OK: constant(["Systems operating normally", styles.green]),
                  Warning: constant(["Systems degraded", styles.orange]),
                  Critical: constant([
                    "Systems in critical condition",
                    styles.red,
                  ]),
                }),
                ([copy, classes]) => (
                  <>
                    <div className={classNames(styles.status, classes)} />
                    <span className={styles.systemStatus}>{copy}</span>
                  </>
                )
              )
            ),

            // TODO: make a better placeholder
            O.getOrElseW(() => null)
          )}
        </div>
      </header>
      <div className={styles.layout}>
        <Block background={O.none}>
          <Thermal degrees={degrees} title="CPU Core" min={30} max={75} />
        </Block>
        <Block background={O.none}>
          <Thermal degrees={degrees} title="GPU Core" min={45} max={80} />
        </Block>
      </div>
      <input
        value={degrees}
        type="number"
        onChange={(ev) => setDegrees(ev.target.valueAsNumber)}
      />
    </div>
  );
};
