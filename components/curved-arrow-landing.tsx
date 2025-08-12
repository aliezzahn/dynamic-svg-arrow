"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CurvedArrow } from "@/components/ui/curved-arrow";
import {
  ArrowRight,
  Github,
  Star,
  CheckCircle2,
  Award,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function CurvedArrowLanding() {
  const heroStartRef = useRef<HTMLDivElement>(null);
  const heroEndRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_10%_-10%,rgba(51,65,85,0.15),transparent)] dark:bg-[radial-gradient(1000px_600px_at_10%_-10%,rgba(59,130,246,0.15),transparent)]" />
      </div>

      {/* Hero */}
      <section className="relative px-4 pt-14 pb-10 sm:pb-16 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              New: Head layering, obstacle routing, 25+ presets
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Design dynamic{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                curved arrows
              </span>{" "}
              for React
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Connect any two elements with beautiful, animated paths. Control
              curve shape, routing, layering, arrowheads, gradients, and
              responsive behavior in real-time.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <Link href="/playground">
                  Open Playground
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 bg-transparent"
                asChild
              >
                <Link href="/docs">Read Docs</Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-lg px-6 py-3"
                asChild
              >
                <Link
                  href="https://github.com/aliezzahn/dynamic-svg-arrow"
                  target="_blank"
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>

          {/* Interactive demo */}
          <div className="relative mt-12 sm:mt-16">
            <div className="mx-auto max-w-5xl">
              <div className="relative h-[420px] sm:h-[520px] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 rounded-2xl shadow-2xl overflow-hidden">
                <div
                  ref={heroStartRef}
                  className="absolute top-12 left-6 sm:left-12 w-24 h-16 sm:w-28 sm:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                >
                  Start
                </div>
                <div
                  ref={heroEndRef}
                  className="absolute bottom-12 right-6 sm:right-12 w-24 h-16 sm:w-28 sm:h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                >
                  End
                </div>

                <CurvedArrow
                  startElement={heroStartRef}
                  endElement={heroEndRef}
                  curveType="elegant"
                  variant="glow"
                  size="lg"
                  animated={true}
                  gradientFrom="#3b82f6"
                  gradientTo="#8b5cf6"
                  showEndArrow={true}
                  endArrowShape="filled-triangle"
                  strokeWidth={5}
                />
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold sm:text-4xl">25+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Curve Types
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold sm:text-4xl">20+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Arrow Heads
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold sm:text-4xl">
                <Star className="w-6 h-6 text-yellow-500" /> 4.9
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Developer Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold sm:text-4xl">0 deps</div>
              <div className="mt-1 text-sm text-muted-foreground">
                No extra packages
              </div>
            </div>
          </div>

          {/* Feature cards */}
          <div className="mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              ref={card1Ref}
              className="relative rounded-2xl bg-card p-6 shadow-lg ring-1 ring-border"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold">Smart Routing</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Route around obstacles or pick shortest paths with smooth
                transitions and responsive updates.
              </p>
            </div>

            <div
              ref={card2Ref}
              className="relative rounded-2xl bg-card p-6 shadow-lg ring-1 ring-border"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold">Layering Control</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Choose whether heads and lines render above or below elements to
                avoid overlap artifacts.
              </p>
            </div>

            <div
              ref={card3Ref}
              className="relative rounded-2xl bg-card p-6 shadow-lg ring-1 ring-border"
            >
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold">Beautiful Effects</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Neon, glow, rainbow, and custom gradients with adjustable
                stroke, size, and animation.
              </p>
            </div>

            {/* Connect feature cards with subtle arrows on large screens */}
            <CurvedArrow
              startElement={card1Ref}
              endElement={card2Ref}
              curveType="smooth"
              variant="subtle"
              size="sm"
              animated={true}
              showEndArrow={true}
              endArrowShape="chevron"
              className="hidden md:block"
            />
            <CurvedArrow
              startElement={card2Ref}
              endElement={card3Ref}
              curveType="smooth"
              variant="subtle"
              size="sm"
              animated={true}
              showEndArrow={true}
              endArrowShape="chevron"
              className="hidden md:block"
            />
          </div>

          {/* CTA band */}
          <div className="mt-14 sm:mt-20 rounded-xl border bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-teal-500/10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-semibold">
                Build interactive flows in minutes
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Start in the Playground and export ready-to-use code with our
                advanced presets.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/playground">Open Playground</Link>
              </Button>
              <Button variant="outline" className="bg-transparent" asChild>
                <Link href="/docs">Explore Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
