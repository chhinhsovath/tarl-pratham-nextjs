import type { Metadata } from "next";
import { Hanuman } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/antd-registry";
import AuthSessionProvider from "@/components/providers/SessionProvider";

const hanuman = Hanuman({ 
  subsets: ["khmer"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-hanuman"
});

export const metadata: Metadata = {
  title: "TaRL ប្រាថម - បង្រៀនតាមកម្រិតត្រឹមត្រូវ",
  description: "ប្រព័ន្ធវាយតម្លៃ និងការតាមដានសម្រាប់កម្មវិធីបង្រៀនតាមកម្រិតត្រឹមត្រូវ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#667eea" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TaRL Pratham" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="none" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
      </head>
      <body className={`${hanuman.variable} font-khmer bg-white`} style={{ fontFamily: "'Hanuman', 'Khmer OS', sans-serif", backgroundColor: 'white' }}>
        <AuthSessionProvider>
          <StyledComponentsRegistry>
            {children}
          </StyledComponentsRegistry>
        </AuthSessionProvider>
      </body>
    </html>
  );
}