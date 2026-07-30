import "./globals.css";
import Header from "../components/Header";
import AiChatWidget from "../components/AiChatWidget";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

export const metadata = {
  title: "Carvora - Search. Research. Drive.",
  description: "Buy and sell used cars across India",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f8fafc",
        }}
      >
        <SmoothCursor />

        <Header />

        {children}

        <AiChatWidget />
      </body>
    </html>
  );
}