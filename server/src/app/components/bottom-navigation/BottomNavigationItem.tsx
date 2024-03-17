"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import styles from "./BottomNavigationItem.module.scss";


interface Props {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function BottomNavigationItem({ label, icon, href }: Props) {
  const path = usePathname();
  return <Link href={href} className={clsx(styles.link, ((href !== "/" && path.startsWith(href)) || (href === path)) && styles.active)}>
    <span className={styles.icon}>{ icon }</span>
    <span>{label}</span>
  </Link>;
}
