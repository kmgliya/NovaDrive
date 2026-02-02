import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google"; // Импортируем шрифты
import "./globals.css";
import { Header } from "@/widgets/header/ui/Header";
import { Providers } from "@/app/providers";

// Настраиваем шрифт
const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700", "800"], // Берем жирные начертания для заголовков
  variable: "--font-manrope"
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "NovaDrive | Premium Car Rental",
  description: "Rent the best cars in the city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${inter.variable} font-sans antialiased text-white bg-dark min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1 pt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}