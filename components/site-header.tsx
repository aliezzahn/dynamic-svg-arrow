"use client";

import Link from "next/link";
import { Github, Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Demo", href: "/#demo" },
    { name: "Playground", href: "/playground" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
        <div className="container mx-auto flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                CurvedArrow
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://github.com/aliezzahn/dynamic-svg-arrow"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold">CurvedArrow</span>
          </Link>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 pb-4 border-b"
                  >
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">CurvedArrow</span>
                  </Link>

                  <nav className="flex flex-col space-y-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-lg font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      asChild
                    >
                      <Link
                        href="https://github.com/aliezzahn/dynamic-svg-arrow"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile/Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden">
        <div className="grid grid-cols-3 h-16">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors hover:text-primary active:text-primary"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {item.name === "Demo" && (
                  <div className="w-4 h-4 rounded bg-current opacity-60" />
                )}
                {item.name === "Playground" && <Zap className="h-4 w-4" />}
                {item.name === "Docs" && (
                  <div className="w-4 h-4 bg-current rounded-sm opacity-60" />
                )}
              </div>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
