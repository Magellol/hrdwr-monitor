import "normalize.css";
import * as React from "react";
import styles from "./App.css";
import { Block } from "./Block";
import "./Globals.css";
import { Thermal } from "./Thermal";

export const App: React.FC = () => {
  const [degrees, setDegrees] = React.useState(30);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Block className={styles.gaugesBlock}></Block>
        <Block className={styles.fansBlock}></Block>
        <div className={styles.thermalBlock}>
          <Block>
            <Thermal degrees={degrees} title="CPU Core" />
          </Block>
          <Block>
            <Thermal degrees={degrees} title="GPU Core" />
          </Block>
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
