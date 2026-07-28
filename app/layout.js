import "./globals.css";
import Header from "../components/Header";
import AiChatWidget from "../components/AiChatWidget";

export const metadata = {
  title: "Car Becho - Buy Old Cars",
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
        <Header />
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}