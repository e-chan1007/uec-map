import Map from "../components/map/Map";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <Map />
    </main>
  );
}
