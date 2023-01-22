import { ThermalGauge } from "./ThermalGauge/ThermalGauge";
export const App: React.FC = () => (
  <div style={{ background: "blue" }}>
    <ThermalGauge size={200} paths={[]} />
  </div>
);
