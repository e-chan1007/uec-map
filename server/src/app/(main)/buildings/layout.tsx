import styles from "./layout.module.scss";

export default function BuildingsLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.container}>
    {children}
  </div>;
}
