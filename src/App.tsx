import { ThermalGauge, Temp } from "./ThermalGauge/ThermalGauge";
import * as React from "react";
import "normalize.css";
import { constant, pipe } from "fp-ts/es6/function";

export const App: React.FC = () => {
  const [temp, setTemp] = React.useState(Temp.mk.Cool);

  return (
    <div
      style={{
        background:
          "linear-gradient(rgb(63, 1, 62), rgb(19, 28, 53)) rgb(19, 28, 53)",
        padding: 20,
      }}
    >
      <ThermalGauge size={175} paths={[]} temp={temp} />
      <button
        onClick={() => {
          pipe(
            setTemp(
              Temp.match({
                Hot: constant(Temp.mk.Cool),
                Cool: constant(Temp.mk.Hot),
              })
            )
          );
        }}
      >
        test temp
      </button>
    </div>
  );
};
