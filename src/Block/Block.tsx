import styles from "./Block.css";
import classNames from "classnames";

export const Block: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={classNames(styles.container, className)}>
    {/* <div className={styles.bg} /> */}
    {children}
  </div>
);
