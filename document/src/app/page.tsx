import dynamic from "next/dynamic";

import Map from "./components/Map";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Map />
    </main>
  );
}
