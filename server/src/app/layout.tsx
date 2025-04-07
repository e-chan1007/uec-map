import { Noto_Sans_JP } from "next/font/google";

import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import styles from "./layout.module.scss";

import type { Metadata } from "next";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = { title: "UEC学内マップ" };

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
