import "normalize.css";
import "./Globals.css";
import * as O from "fp-ts/Option";
import * as React from "react";
import { Thermal } from "./Thermal";
import { Block } from "./Block";
import styles from "./App.css";

export const App: React.FC = () => {
  const [degrees, setDegrees] = React.useState(30);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Block background={O.none}>
          <Thermal degrees={degrees} title="CPU Core" />
        </Block>
        <Block background={O.none}>
          <Thermal degrees={degrees} title="GPU Core" />
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
