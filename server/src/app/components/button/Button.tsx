import clsx from "clsx";
import Link from "next/link";

import styles from "./Button.module.scss";

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "filled" | "outlined";
}

export function Button({ children, href, variant = "filled", onClick }: Props) {
  return href ? (
    <Link href={href} onClick={onClick} className={clsx(styles.button, styles[variant])}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={clsx(styles.button, styles[variant])}>
      {children}
    </button>
  );
}
