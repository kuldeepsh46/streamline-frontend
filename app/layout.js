
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import BottomTab from "./components/BottomTab";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Experience Streamline",
  description: "Find Your Swim Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
        {children}
        </ClientLayout>
      </body>
    </html>
  );
}
