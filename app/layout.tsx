import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recoil Lab — CS2 压枪训练",
  description: "桌面端第一人称压枪训练场，覆盖当前 CS2 枪械并支持灵敏度与准星校准。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
