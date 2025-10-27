import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Solvra - Precision Attendance & Marks Tracking",
  description: "Automated attendance system with Geo-fencing, QR-based verification, and Face ID authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-primary-bg">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}