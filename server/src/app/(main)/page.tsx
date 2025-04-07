import { Suspense } from "react";
import Map from "../components/map/Map";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <Suspense>
      <main className={styles.main}>
        <Map />
      </main>
    </Suspense>
  );
}
