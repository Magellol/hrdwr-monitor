import classNames from "classnames";
import { curveLinearClosed, lineRadial } from "d3-shape";
import { pipe } from "fp-ts/es6/function";
import * as IO from "fp-ts/es6/IO";
import * as O from "fp-ts/es6/Option";
import range from "lodash.range";
import Rainbow from "rainbowvis.js";
import React from "react";
import styles from "./ThermalGauge.css";

type Path = {
  id: number;
  speed: number;
  strokeWidth: number;
  waveAmplitude: number;
  waves: number;
  radiusDelta?: number;
};

const defaultPaths: Array<Path> = [
  {
    id: 0,
    speed: 500,
    strokeWidth: 3,
    waveAmplitude: 9,
    radiusDelta: 0,
    waves: 4,
  },
  {
    id: 1,
    radiusDelta: -7,
    speed: -1000,
    strokeWidth: 3,
    waveAmplitude: 14,
    waves: 2,
  },
  {
    id: 2,
    radiusDelta: 0,
    speed: -400,
    strokeWidth: 3,
    waveAmplitude: 2,
    waves: 30,
  },
];

type Props = {
  paths: Path[];
  size: number;
  degrees: number;
};

const gaugeRainbow = new Rainbow();
gaugeRainbow.setSpectrum("#0000b3", "#9a0000");
gaugeRainbow.setNumberRange(35, 80);

const textRainbow = new Rainbow();
textRainbow.setSpectrum("#001732", "#370000");
textRainbow.setNumberRange(35, 80);

export const ThermalGauge: React.FC<Props> = React.memo(({ size, degrees }) => {
  const color = `#${gaugeRainbow.colourAt(degrees)}`;
  const svgSize = size * 2;
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const frameIdRef = React.useRef(0);
  const getPath = generatePath(size);

  React.useEffect(() => {
    function draw(context: CanvasRenderingContext2D) {
      context.lineWidth = 3;
      context.filter = "blur(0.5px)";
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, svgSize, svgSize);
      context.setTransform(1, 0, 0, 1, svgSize / 2, svgSize / 2);
      defaultPaths.forEach((path, i) => {
        context.strokeStyle = color;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = -1;
        context.shadowBlur = 20;
        context.stroke(new Path2D(getPath(path, i)));
      });

      frameIdRef.current = window.requestAnimationFrame(() => draw(context));
    }

    const startDrawing = pipe(
      O.fromNullable(canvasRef.current),
      O.mapNullable((canvas) => canvas.getContext("2d")),
      O.fold(
        () => IO.of(frameIdRef.current),
        (context) =>
          pipe(
            window.requestAnimationFrame(() => draw(context)),
            IO.of
          )
      )
    );

    frameIdRef.current = startDrawing();

    return () => window.cancelAnimationFrame(frameIdRef.current);
  }, [color]);

  return (
    <div
      style={{ width: svgSize, height: svgSize }}
      className={styles.container}
    >
      <div
        style={{
          "--main": color,
          "--faded": `${color}40`,
          width: size,
          height: size,
        }}
        className={classNames(styles.circle)}
      ></div>
      <span
        className={styles.degrees}
        style={{ color: `#${textRainbow.colorAt(degrees)}` }}
      >
        {degrees}°
      </span>
      <canvas
        ref={canvasRef}
        width={svgSize}
        height={svgSize}
        className={styles.canvas}
      ></canvas>
    </div>
  );
});

ThermalGauge.displayName = "Circle";

function generatePath(size: number) {
  const points = range(0, Math.PI * 2, Math.PI / 70);
  const line = lineRadial<number>()
    .curve(curveLinearClosed)
    .angle((a) => a);

  return ({ radiusDelta = 0, ...path }: Path, datumIndex: number) => {
    return line.radius((angle) => {
      const t = Date.now() / path.speed;
      return (
        size / 2 +
        radiusDelta +
        Math.cos(angle * path.waves - datumIndex / 3 + t) *
          Math.pow((1 + Math.cos(angle - t)) / 2, 3) *
          path.waveAmplitude
      );
    })(points)!; // @todo fix non null
  };
}
