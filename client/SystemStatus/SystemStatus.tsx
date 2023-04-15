import * as Sum from "@unsplash/sum-types";
import classNames from "classnames";
import { constant, pipe } from "fp-ts/function";
import styles from "./SystemStatus.css";

export type State =
  | Sum.Member<"Loading">
  | Sum.Member<"Success">
  | Sum.Member<"Failure">;

export const State = Sum.create<State>();

export type Props = {
  state: State;
};

export const SystemStatus: React.FC<Props> = ({ state }) => {
  return (
    <div className={styles.statusDotContainer}>
      <div
        className={classNames(
          styles.statusDot,
          pipe(
            state,
            State.match({
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
