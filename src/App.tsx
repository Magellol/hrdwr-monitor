import { ThermalGauge } from "./ThermalGauge/ThermalGauge";
import "normalize.css";

export const App: React.FC = () => (
  <div
    style={{
      background:
        "linear-gradient(rgb(63, 1, 62), rgb(19, 28, 53)) rgb(19, 28, 53)",
      padding: 20,
    }}
  >
    <ThermalGauge size={175} paths={[]} />
  </div>
);
