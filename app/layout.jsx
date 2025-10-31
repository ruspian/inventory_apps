import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { ToasterProvider } from "@/providers/ToasterProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UsahaKu",
  description: "Platform cerdas untuk mengelola dan mengembangkan usaha Anda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToasterProvider>
            <div className="flex h-screen">
              {/* Konten utama yang mengisi sisa ruang */}
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </ToasterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
