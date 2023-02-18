import styles from "./Block.css";
import classNames from "classnames";

export const Block: React.FC<{
  children: React.ReactNode;
  title: string;
  className?: string;
  containerClassName?: string;
}> = ({ children, title, className, containerClassName }) => (
  <div className={classNames(styles.container, containerClassName)}>
    {/* <div className={styles.bg} /> */}
    <header className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
    </header>
    <div className={classNames(styles.content, className)}>{children}</div>
  </div>
);
