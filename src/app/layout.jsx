import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MagicCraft Teammate Finder",
  description: "Find your perfect MagicCraft teammates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 pb-12">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
