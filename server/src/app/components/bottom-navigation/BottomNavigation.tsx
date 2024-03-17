import { MdLayers, MdMap } from "react-icons/md";

import { BottomNavigationItem } from "./BottomNavigationItem";
import styles from "./styles.module.scss";

export function BottomNavigation() {
  return <div className={styles.container}>
    <nav className={styles.navigation}>
      <BottomNavigationItem href="/" label="マップ" icon={<MdMap />} />
      <BottomNavigationItem href="/buildings" label="施設一覧" icon={<MdLayers />} />
    </nav>
  </div>;
}
