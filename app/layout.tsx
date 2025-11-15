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

// 한글 폰트 - 국립박물관문화재단클래식B (기본)
const museumClassicFont = localFont({
  src: './fonts/국립박물관문화재단클래식B.otf',
  variable: '--font-museum-classic',
  weight: '400 700 900',
  display: 'swap',
  fallback: ['serif'],
});

// 한글 폰트 - 궁서체
const gungseoFont = localFont({
  src: './fonts/ChosunCentennial_otf.otf',
  variable: '--font-gungseo',
  weight: '400 700 900',
  display: 'swap',
  fallback: ['Gungsuh', 'Gungseo', '궁서', 'serif'],
});

// 한글 폰트 - 바탕체
const batangFont = localFont({
  src: './fonts/KoPubWorld Batang_Pro Medium.otf',
  variable: '--font-batang',
  weight: '400 700 900',
  display: 'swap',
  fallback: ['Batang', '바탕', 'serif'],
});

// 한글 폰트 - 돋움체
const dotumFont = localFont({
  src: './fonts/KoPubWorld Dotum_Pro Medium.otf',
  variable: '--font-dotum',
  weight: '400 700 900',
  display: 'swap',
  fallback: ['Dotum', '돋움', 'sans-serif'],
});

// 한글 폰트 - 명조체
const myeongjoFont = localFont({
  src: './fonts/NanumMyeongjo.otf',
  variable: '--font-myeongjo',
  weight: '400 700 900',
  display: 'swap',
  fallback: ['Myeongjo', '명조', 'serif'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${museumClassicFont.variable} ${gungseoFont.variable} ${batangFont.variable} ${dotumFont.variable} ${myeongjoFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
