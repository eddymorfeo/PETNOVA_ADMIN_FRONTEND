import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

import { AuthProvider } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PETNOVA ADMIN",
  description: "Portal administrativo de PETNOVA",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body
        suppressHydrationWarning
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-slate-50 antialiased",
        )}
      >
        <AuthProvider>
          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
            expand
            toastOptions={{
              classNames: {
                toast: "rounded-2xl border border-slate-200 shadow-lg",
                title: "text-sm font-semibold",
                description: "text-xs text-slate-500",
                actionButton: "rounded-xl",
                cancelButton: "rounded-xl",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}