import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CurvedArrow</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Dynamic SVG arrows for React applications. Create beautiful curved
              connections with ease.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://linkedin.com" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:contact@curvedarrow.dev" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#demo"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/playground"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Playground
                </a>
              </li>
              <li>
                <a
                  href="/examples"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/getting-started"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href="/api-reference"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="/tutorials"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="/changelog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-muted-foreground">
            <p>&copy; 2024 CurvedArrow. All rights reserved.</p>
            <div className="flex space-x-4">
              <a
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="hover:text-foreground transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Built with ❤️ using React & Next.js
          </div>
        </div>
      </div>
    </footer>
  );
}
