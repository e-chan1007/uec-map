import { BottomNavigation } from "../components/bottom-navigation/BottomNavigation";

import styles from "./layout.module.scss";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "UEC学内マップ" };

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      {children}
      <BottomNavigation />
    </div>
  );
}
