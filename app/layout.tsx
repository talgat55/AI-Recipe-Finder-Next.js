import type { Metadata } from "next";
import "./globals.css";

/**
 * Root layout wraps every page. Single place for global styles, fonts, and
 * shared structure (e.g. header/footer). Children render the current route.
 */
export const metadata: Metadata = {
  title: "FridgeAI",
  description: "Get recipe ideas from ingredients you have",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
