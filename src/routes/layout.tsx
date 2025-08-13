import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/ui/toaster";
import { Outlet } from "@modern-js/runtime/router";
import "./index.css";

export default function Layout() {
  return (
    <div
      lang="en"
      className={cn("min-h-screen bg-background text-foreground antialiased")}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SiteHeader />
        <Outlet />
        <Toaster />
      </ThemeProvider>
    </div>
  );
}
