import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_KR, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 한글 폰트 - 궁서체 대체 (Nanum Myeongjo - 명조체)
const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

// 한글 폰트 - 바탕체 (Noto Serif KR - 세리프)
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKR.variable} ${nanumMyeongjo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
