import * as O from "fp-ts/Option";
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
