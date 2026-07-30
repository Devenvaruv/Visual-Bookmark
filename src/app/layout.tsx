import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Bookmark",
  description: "A visual bookmark manager with boards, groups, and draggable bookmark cards.",
  icons: {
    icon: "/visual-bookmark-logo.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
