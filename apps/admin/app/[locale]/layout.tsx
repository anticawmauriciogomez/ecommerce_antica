import type { Metadata } from "next";
import localFont from "next/font/local";
import "./../globals.css";

import { notFound } from "next/navigation";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Antica Admin",
  description: "Antica E-commerce CMS",
};

import { Toaster } from "@repo/ui/toast";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Solo permitimos es y en. Cualquier otra cosa (como "login") da un 404
  // lo cual fuerza a que el middleware haga su trabajo redireccionando
  if (locale !== 'es' && locale !== 'en') {
    notFound();
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster position="top-right" expand={false} richColors />
      </body>
    </html>
  );
}
