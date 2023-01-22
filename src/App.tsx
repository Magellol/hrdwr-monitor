import "normalize.css";
import * as React from "react";
import { ThermalGauge } from "./ThermalGauge/ThermalGauge";

export const App: React.FC = () => {
  const [degrees, setDegrees] = React.useState(30);

  return (
    <div
      style={{
        background:
          "linear-gradient(rgb(63, 1, 62), rgb(19, 28, 53)) rgb(19, 28, 53)",
        padding: 20,
      }}
    >
      <ThermalGauge size={175} paths={[]} degrees={degrees} />
      <input
        value={degrees}
        type="number"
        onChange={(ev) => setDegrees(ev.target.valueAsNumber)}
      />
    </div>
  );
};
