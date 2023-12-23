import dynamic from "next/dynamic";

import Map from "./components/Map";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>UEC学内マップ(試験公開中)</h1>
      </nav>
      <header className={styles.header}>
        <p>
          地図データ(GeoJSON, FlatGeobuf形式)を公開しています。電通大生であれば自由にご利用いただけます。
          リポジトリ・使用方法は<a href="https://github.com/e-chan1007/uec-map/" target="_blank" rel="noreferrer noopener noreferrer">こちら</a>
        </p>
      </header>
      <main className={styles.main}>
        <Map />
      </main>
    </div>
  );
}
