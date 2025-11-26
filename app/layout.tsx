import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bridal",
  description: "理想の結婚式や前撮りがすぐ見つかる Bridal。世界観・価格・規模・場所で検索でき、自然文のキーワード検索にも対応。迷ったら LINE で相談も可能。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
