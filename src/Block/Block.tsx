import styles from "./Block.css";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

export const Block: React.FC<{
  children: React.ReactNode;
  background: O.Option<NonNullable<React.CSSProperties["background"]>>;
}> = ({ children, background }) => (
  <div
    className={styles.container}
    style={{
      background: pipe(
        background,
        O.getOrElseW(() => "black")
      ),
    }}
  >
    {children}
  </div>
);
