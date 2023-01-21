import { ThermalGauge } from "./ThermalGauge/ThermalGauge";
export const App: React.FC = () => (
  <div style={{ background: "blue" }}>
    <ThermalGauge size={600} paths={[]} />
  </div>
);
