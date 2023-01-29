import Rainbow from "rainbowvis.js";
import styles from "./VelocityGauge.css";

const gaugeRainbow = new Rainbow();
gaugeRainbow.setSpectrum("#0000b3", "#9a0000");

export type Props = {
  min: number;
  max: number;
  n: number;
};

export const VelocityGauge: React.FC<Props> = ({ min, max, n }) => {
  // TODO: all of these operations are unsafe: e.g unsafe division; if min > max etc
  const value = Math.min(n, max);
  // 180 is the semi circle max degree
  const degrees = (value / max) * 180;
  gaugeRainbow.setNumberRange(min, max);

  return (
    <div>
      <div className={styles.mask}>
        <div
          className={styles.semiCircle}
          style={{
            background: `#${gaugeRainbow.colorAt(n)}`,
          }}
        ></div>
        <div
          className={styles.semiCircleMask}
          style={{
            rotate: `${degrees}deg`,
          }}
        ></div>
      </div>
    </div>
  );
};
