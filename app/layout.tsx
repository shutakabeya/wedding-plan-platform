import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "結婚式プラン送客プラットフォーム",
  description: "理想の結婚式・前撮りプランを見つけよう",
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
