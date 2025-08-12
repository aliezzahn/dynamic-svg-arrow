import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "CurvedArrow — Dynamic SVG arrows for React",
  description:
    "Design dynamic curved arrows with routing, layering, and beautiful presets. Playground and advanced docs included.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* If you have a SiteHeader, it will pick theme from ThemeProvider */}
          {/* <SiteHeader /> */}
          <SiteHeader />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
