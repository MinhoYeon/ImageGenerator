import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 커스텀 폰트 - 궁서체 (로컬 파일 사용)
const gungseoFont = localFont({
  src: './fonts/gungseo.otf', // 또는 gungseo.ttf
  variable: '--font-gungseo',
  weight: '400 700 900', // 폰트가 지원하는 weight
  display: 'swap',
});

// 커스텀 폰트 - 바탕체 (로컬 파일 사용)
const batangFont = localFont({
  src: './fonts/batang.otf', // 또는 batang.ttf
  variable: '--font-batang',
  weight: '400 700 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "도장 이미지 생성기",
  description: "한국 전통 도장 이미지를 생성하고 다운로드할 수 있는 웹 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gungseoFont.variable} ${batangFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
