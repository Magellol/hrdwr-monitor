import { curveLinearClosed, lineRadial } from "d3-shape";
import { constant, identity, pipe } from "fp-ts/es6/function";
import * as IO from "fp-ts/es6/IO";
import * as O from "fp-ts/es6/Option";
import range from "lodash.range";
import Rainbow from "rainbowvis.js";
import React from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import styles from "./ThermalGauge.css";
import * as Color from "../Color";
import { constNull } from "fp-ts/lib/function";

type Path = {
  speed: number;
  strokeWidth: number;
  waveAmplitude: number;
  waves: number;
  radiusDelta?: number;
  color: (current: string) => string;
};

export const pathSample1: Array<Path> = [
  {
    radiusDelta: 2,
    speed: 600,
    strokeWidth: 10,
    waveAmplitude: 8,
    waves: 3,
    color: Color.changeShade(-90),
  },
  {
    radiusDelta: -7,
    speed: -600,
    strokeWidth: 10,
    waveAmplitude: 10,
    waves: 3,
    color: Color.changeShade(-50),
  },
  {
    radiusDelta: 1,
    speed: -400,
    strokeWidth: 3,
    waveAmplitude: 10,
    waves: 4,
    color: Color.changeShade(-10),
  },
  {
    radiusDelta: 1,
    speed: 400,
    strokeWidth: 3,
    waveAmplitude: 10,
    waves: 4,
    color: Color.changeShade(-10),
  },
  {
    radiusDelta: -7,
    speed: -800,
    strokeWidth: 4,
    waveAmplitude: 15,
    waves: 2,
    color: Color.changeShade(-10),
  },

  {
    radiusDelta: 0,
    speed: -400,
    strokeWidth: 4,
    waveAmplitude: 3,
    waves: 30,
    color: identity,
  },
  {
    radiusDelta: -12,
    speed: -600,
    strokeWidth: 0.5,
    waveAmplitude: 3,
    waves: 4,
    color: constant("rgba(255, 255, 255, 0.6"),
  },
];

export const pathSample2: Array<Path> = [
  {
    radiusDelta: 2,
    speed: -600,
    strokeWidth: 10,
    waveAmplitude: 8,
    waves: 3,
    color: Color.changeShade(-90),
  },
  {
    radiusDelta: -7,
    speed: 600,
    strokeWidth: 10,
    waveAmplitude: 10,
    waves: 3,
    color: Color.changeShade(-50),
  },
  {
    radiusDelta: 1,
    speed: -400,
    strokeWidth: 3,
    waveAmplitude: 10,
    waves: 4,
    color: Color.changeShade(-10),
  },
  {
    radiusDelta: 1,
    speed: 400,
    strokeWidth: 3,
    waveAmplitude: 10,
    waves: 4,
    color: Color.changeShade(-10),
  },
  {
    radiusDelta: 0,
    speed: 400,
    strokeWidth: 3,
    waveAmplitude: 3,
    waves: 30,
    color: identity,
  },
  {
    radiusDelta: -12,
    speed: 600,
    strokeWidth: 0.5,
    waveAmplitude: 3,
    waves: 4,
    color: constant("rgba(255, 255, 255, 0.6"),
  },
];

export type Props = {
  size: number;
  degrees: O.Option<number>;
  min: number;
  max: number;
  id: string;
  paths: Array<Path>;
};

const gaugeRainbow = new Rainbow();
gaugeRainbow.setSpectrum("#0000b3", "#9a0000");

const textRainbow = new Rainbow();
textRainbow.setSpectrum("#011631", "#3b0000");

export const ThermalGauge: React.FC<Props> = React.memo(
  ({ size, degrees, id, min, max, paths }) => {
    gaugeRainbow.setNumberRange(min, max);
    textRainbow.setNumberRange(min, max);

    const canvasSize = size * 1.2;

    const color = pipe(
      degrees,
      O.getOrElse(constant(0)),
      (n) => `#${gaugeRainbow.colourAt(n)}`
    );
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const frameIdRef = React.useRef(0);
    const getPath = generatePath(size / 2);

    const particlesInit = React.useCallback(async (engine: Engine) => {
      // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(engine);
    }, []);

    React.useEffect(() => {
      function draw(context: CanvasRenderingContext2D) {
        context.lineWidth = 3;
        context.filter = "blur(0.5px)";
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvasSize, canvasSize);
        context.setTransform(1, 0, 0, 1, canvasSize / 2, canvasSize / 2);
        paths.forEach((path, i) => {
          context.lineWidth = path.strokeWidth;
          context.strokeStyle = path.color(color);
          context.shadowOffsetX = 1;
          context.shadowOffsetY = -1;
          context.shadowBlur = 20;
          // context.shadowColor = "rgba(255, 255, 255, 0.1)";
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
      <div className={styles.container}>
        <div
          style={{
            "--thermal-gauge-main-color": color,
            "--thermal-gauge-faded-color": `${color}40`,
            width: size,
            height: size,
          }}
          className={styles.circle}
        ></div>

        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className={styles.canvas}
        ></canvas>
        <Particles
          id={id}
          className={styles.particlesContainer}
          init={particlesInit}
          options={{
            fullScreen: false,
            fpsLimit: 60,
            pauseOnBlur: true,
            particles: {
              move: {
                collisions: false,
                direction: "inside",
                enable: true,
                outModes: {
                  default: "out",
                },
                random: true,
                speed: {
                  min: 0.2,
                  max: 1,
                },
              },
              number: {
                value: 125,
              },
              opacity: {
                value: {
                  min: 0.05,
                  max: 0.1,
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: 1,
              },
            },
            detectRetina: true,
          }}
        />
        {pipe(
          degrees,
          O.match(constNull, (n) => (
            <span
              className={styles.degrees}
              style={{
                color: pipe(
                  degrees,
                  O.getOrElse(constant(0)),
                  (n) => `#${textRainbow.colourAt(n)}`
                ),
              }}
            >
              {n}
            </span>
          ))
        )}
      </div>
    );
  }
);

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
        size +
        radiusDelta +
        Math.cos(angle * path.waves - datumIndex / 3 + t) *
          Math.pow((1 + Math.cos(angle - t)) / 2, 3) *
          path.waveAmplitude
      );
    })(points)!; // @todo fix non null
  };
}
