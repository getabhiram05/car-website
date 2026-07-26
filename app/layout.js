import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "CarDekho Style Marketplace",
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
      </body>
    </html>
  );
}