import "normalize.css";
import * as React from "react";
import styles from "./App.css";
import { Block } from "./Block";
import "./Globals.css";
import { Thermal } from "./Thermal";
import { UsageGauge } from "./UsageGauge/UsageGauge";
import { pathSample1, pathSample2 } from "./ThermalGauge";

export const App: React.FC = () => {
  const [degrees, setDegrees] = React.useState(30);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <Block
          containerClassName={styles.gaugesBlock}
          className={styles.gaugesContent}
          title="Load"
        >
          <UsageGauge
            min={0}
            max={24000}
            n={15000}
            unit="MBs"
            title="GPU VRAM"
          />
          <UsageGauge
            min={0}
            max={10000}
            n={3000}
            unit="Hz"
            title="GPU Clock"
          />
          <UsageGauge min={0} max={32000} n={3000} unit="MBs" title="DRAM" />
        </Block>
        <Block containerClassName={styles.fansBlock} title="Fan speeds"></Block>
        <div className={styles.thermalBlock}>
          <Block title="CPU Core">
            <Thermal degrees={degrees} id="cpu-core" paths={pathSample1} />
          </Block>
          <Block title="GPU Core">
            <Thermal degrees={degrees} id="gpu-core" paths={pathSample2} />
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
