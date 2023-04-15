import * as Sum from "@unsplash/sum-types";
import classNames from "classnames";
import { constant, pipe } from "fp-ts/function";
import styles from "./Dot.css";

export type DotState =
  | Sum.Member<"Loading">
  | Sum.Member<"Success">
  | Sum.Member<"Failure">;

export const DotState = Sum.create<DotState>();

export type Props = {
  state: DotState;
};

export const Dot: React.FC<Props> = ({ state }) => {
  return (
    <div className={styles.statusDotContainer}>
      <div
        className={classNames(
          styles.statusDot,
          pipe(
            state,
            DotState.match({
              Loading: constant(styles.loading),
              Success: constant(styles.success),
              Failure: constant(styles.failure),
            })
          )
        )}
      />
    </div>
  );
};
