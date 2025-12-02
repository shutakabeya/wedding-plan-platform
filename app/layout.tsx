import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QMV514TF3P"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QMV514TF3P');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
