import styles from "./Block.css";

export const Block: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.bg} />
    {children}
  </div>
);
