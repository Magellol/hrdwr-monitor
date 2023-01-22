import "normalize.css";
import "./Globals.css";
import * as React from "react";
import { Thermal } from "./Thermal";

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
      <Thermal degrees={degrees} title="CPU Core" />
      <input
        value={degrees}
        type="number"
        onChange={(ev) => setDegrees(ev.target.valueAsNumber)}
      />
    </div>
  );
};
