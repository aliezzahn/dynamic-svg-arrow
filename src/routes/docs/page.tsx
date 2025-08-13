import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { Link2, ChevronRight, Star, Sparkles } from "lucide-react";
import { Link } from "@modern-js/runtime/router";

type Section = { id: string; title: string; intro?: string };

const sections: Section[] = [
  { id: "overview", title: "Overview" },
  { id: "installation", title: "Installation" },
  { id: "quick-start", title: "Quick Start" },
  { id: "geometry", title: "Geometry & Curves" },
  { id: "visuals", title: "Visuals & Animation" },
  { id: "heads", title: "Arrow Heads & Layering" },
  { id: "recipes", title: "Patterns & Recipes" },
  { id: "performance", title: "Performance" },
  { id: "accessibility", title: "Accessibility" },
  { id: "faq", title: "FAQ" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0.1, 0.5] }
    );
    const elements: Element[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    });
    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [ids]);
  return active;
}

function DocHeading({
  anchorId,
  children,
  level = 2,
}: {
  anchorId: string;
  children: string;
  level?: 1 | 2 | 3;
}) {
  const Tag = (["h1", "h2", "h3"] as const)[level - 1] as any;
  const [copied, setCopied] = useState(false);
  const onCopyAnchor = async () => {
    try {
      const url = `${location.origin}${location.pathname}#${anchorId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {}
  };
  return (
    <div className="group flex items-center gap-2">
      <Tag className="scroll-mt-24 text-balance">{children}</Tag>
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
        onClick={onCopyAnchor}
        aria-label={`Copy link to ${children}`}
        title={copied ? "Copied!" : "Copy link"}
      >
        <Link2 className="h-4 w-4" />
      </button>
      {copied && <span className="text-xs text-muted-foreground">Copied</span>}
    </div>
  );
}

export default function DocsPage() {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const active = useActiveSection(ids);

  const installCode = `# npm
npx shadcn@canary add https://dsa.hncore.website/r/curved-arrow.json

# bun
bunx --bun shadcn@canary add https://dsa.hncore.website/r/curved-arrow.json

# pnpm
pnpx shadcn@canary add https://dsa.hncore.website/r/curved-arrow.json`;

  const quickStart = `import React, { useRef } from "react"
import { CurvedArrow } from "curved-arrow-react"

export default function Example() {
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-80 bg-slate-50 rounded-lg">
      <div ref={startRef} className="absolute top-6 left-6 w-20 h-12 bg-emerald-600 rounded text-white grid place-items-center">A</div>
      <div ref={endRef} className="absolute bottom-6 right-6 w-20 h-12 bg-violet-600 rounded text-white grid place-items-center">B</div>

      <CurvedArrow
        startElement={startRef}
        endElement={endRef}
        curveType="elegant"
        variant="glow"
        animated
        gradientFrom="#10b981"
        gradientTo="#8b5cf6"
        showEndArrow
        endArrowShape="filled-triangle"
      />
    </div>
  )
}`;

  const geometrySnippet = `// Choose curve presets or control intensity/direction
<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="s-curve"               // "smooth" | "dramatic" | "s-curve" | "wave" | "around-obstacle" | "shortest-path" | "zigzag" | "elegant"
  curveDirection="auto"             // "auto" | "up" | "down" | "left" | "right"
  curveIntensity={0.6}
/>`;

  const visualsSnippet = `// Animate and style with gradients, stroke width and variants
<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  strokeWidth={3}
  variant="neon"                    // "default" | "glow" | "subtle" | "bold" | "neon" | "fire" | "ice" | "electric" | "shadow" | "rainbow" | "cosmic"
  animated
  animationDuration="2.2s"
  animationDirection="alternate"
  gradientFrom="#06b6d4"
  gradientTo="#f97316"
/>`;

  const headsSnippet = `// Place arrow heads precisely and choose their layering
<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  showStartArrow
  showEndArrow
  startHeadLayer="under"            // "over" | "under"
  endHeadLayer="over"
  startArrowShape="chevron"
  endArrowShape="filled-triangle"
  startArrowSize={10}
  endArrowSize={14}
/>`;

  const obstacleRecipe = `// Route around obstacles, heads stay above nodes
<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  obstacleElements={[blockRef1, blockRef2]}
  curveType="around-obstacle"
  animated
  showStartArrow
  showEndArrow
  startHeadLayer="over"
  endHeadLayer="over"
/>`;

  const jsonConfig = `{
  "curveType": "elegant",
  "variant": "glow",
  "animated": true,
  "gradientFrom": "#10b981",
  "gradientTo": "#8b5cf6",
  "showEndArrow": true
}`;

  const cssTip = `.arrow-canvas {
  /* Helps with crisp rendering on scaled canvases */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <header className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_300px_at_0%_0%,rgba(168,85,247,0.20),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_300px_at_100%_0%,rgba(16,185,129,0.18),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Docs</span>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-violet-300 bg-clip-text text-transparent">
                CurvedArrow Documentation
              </span>
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Connect elements with beautiful, responsive SVG curves. Learn the API,
              explore patterns, and ship polished flows.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> v1.0
              </Badge>
              <Badge>Runtime-safe</Badge>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Button asChild>
                <Link to="/playground">Open Playground</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/#see-it-in-action">See Demos</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mobile sections nav */}
        <div className="lg:hidden -mt-2">
          <div className="flex gap-2 overflow-x-auto py-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs ${
                  active === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-20 self-start">
          <nav className="space-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  active === s.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <span className="truncate">{s.title}</span>
                {active === s.id && <Star className="w-3.5 h-3.5 opacity-80" />}
              </a>
            ))}
          </nav>
          <div className="mt-6">
            <Card>
              <CardContent className="py-4 text-sm text-muted-foreground">
                <div className="mb-1 font-medium text-foreground">Tips</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use refs for dynamic layouts.</li>
                  <li>Try “Fit” mode in the Playground on mobile.</li>
                  <li>Export code with highlighted output.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 space-y-10">
          <section
            id="overview"
            aria-labelledby="overview-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="overview" level={1}>
              Overview
            </DocHeading>
            <p className="text-muted-foreground mt-2">
              CurvedArrow draws smart connector paths between two elements or coordinates.
              It supports multiple curve presets, obstacle routing, animated strokes,
              gradient styling, and precise arrow head layering so your diagrams and
              product UIs feel intentional and clear.
            </p>
            <Card className="mt-4">
              <CardContent className="py-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="font-medium">Flexible Targets</div>
                  <div className="text-muted-foreground">
                    Refs or absolute coordinates
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="font-medium">Polished Visuals</div>
                  <div className="text-muted-foreground">
                    Gradients, glow, neon variants
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          <section
            id="installation"
            aria-labelledby="installation-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="installation">Installation</DocHeading>
            <p className="text-muted-foreground mt-2">
              Install via your preferred package manager:
            </p>
            <div className="mt-4">
              <CodeBlock code={installCode} language="bash" filename="install.sh" />
            </div>
          </section>

          <Separator />

          <section
            id="quick-start"
            aria-labelledby="quick-start-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="quick-start">Quick Start</DocHeading>
            <p className="text-muted-foreground mt-2">
              Create two target refs and render CurvedArrow between them. It updates
              automatically when layout changes.
            </p>
            <div className="mt-4">
              <CodeBlock code={quickStart} language="tsx" filename="Example.tsx" />
            </div>
          </section>

          <Separator />

          <section
            id="geometry"
            aria-labelledby="geometry-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="geometry">Geometry & Curves</DocHeading>
            <p className="text-muted-foreground mt-2">
              Choose a curve preset and optionally override direction and intensity. Use
              obstacles to automatically route around elements.
            </p>
            <div className="mt-4">
              <CodeBlock code={geometrySnippet} language="tsx" filename="geometry.tsx" />
            </div>
          </section>

          <Separator />

          <section
            id="visuals"
            aria-labelledby="visuals-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="visuals">Visuals & Animation</DocHeading>
            <p className="text-muted-foreground mt-2">
              Style the stroke, apply gradients, and enable animation. Most variants are
              designed to preserve clarity on light and dark backgrounds.
            </p>
            <div className="mt-4">
              <CodeBlock code={visualsSnippet} language="tsx" filename="visuals.tsx" />
            </div>
            <div className="mt-4">
              <CodeBlock code={cssTip} language="css" filename="styles.css" />
            </div>
          </section>

          <Separator />

          <section id="heads" aria-labelledby="heads-heading" className="scroll-mt-28">
            <DocHeading anchorId="heads">Arrow Heads & Layering</DocHeading>
            <p className="text-muted-foreground mt-2">
              Control start/end arrow heads, their sizes, shapes, and z-order relative to
              the connecting line and target nodes.
            </p>
            <div className="mt-4">
              <CodeBlock code={headsSnippet} language="tsx" filename="heads.tsx" />
            </div>
          </section>

          <Separator />

          <section
            id="recipes"
            aria-labelledby="recipes-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="recipes">Patterns & Recipes</DocHeading>
            <p className="text-muted-foreground mt-2">
              Use these patterns to speed up implementation.
            </p>
            <div className="mt-4">
              <CodeBlock
                code={obstacleRecipe}
                language="tsx"
                filename="obstacle-route.tsx"
              />
            </div>
            <div className="mt-4">
              <CodeBlock code={jsonConfig} language="json" filename="preset.json" />
            </div>
          </section>

          <Separator />

          <section
            id="performance"
            aria-labelledby="performance-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="performance">Performance</DocHeading>
            <ul className="list-disc pl-6 text-sm text-muted-foreground mt-3 space-y-1">
              <li>
                Prefer refs over frequent coordinate recalculations in dynamic layouts.
              </li>
              <li>
                Batch DOM reads/writes; if animating positions, use requestAnimationFrame.
              </li>
              <li>Throttle resize/scroll listeners when observing many nodes.</li>
              <li>
                Use simpler variants (e.g., "subtle") where many arrows are on screen.
              </li>
            </ul>
          </section>

          <Separator />

          <section
            id="accessibility"
            aria-labelledby="accessibility-heading"
            className="scroll-mt-28"
          >
            <DocHeading anchorId="accessibility">Accessibility</DocHeading>
            <p className="text-muted-foreground mt-2">
              Ensure connected elements have descriptive labels. Maintain color contrast
              for strokes and heads. If arrows indicate flow, consider providing an ARIA
              description or textual summary.
            </p>
          </section>

          <Separator />

          <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-28">
            <DocHeading anchorId="faq">FAQ</DocHeading>
            <div className="mt-3 text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Does it require extra packages?</strong> No. It uses SVG and React
                only.
              </p>
              <p className="mb-2">
                <strong>Can I use static coordinates?</strong> Yes. Pass startX/startY and
                endX/endY.
              </p>
              <p className="mb-2">
                <strong>How do I avoid overlap with content?</strong> Use obstacleElements
                and head layering.
              </p>
            </div>
            <div className="pt-4 flex gap-3">
              <Button asChild>
                <Link to="/playground">Try in Playground</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/#see-it-in-action">See Demos</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Inline token color styles to ensure vivid multi-color without external CSS */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          .token.keyword { color: rgb(192,132,252); }       /* purple-400 */
          .token.string { color: rgb(34,197,94); }          /* green-500 */
          .token.number { color: rgb(249,115,22); }         /* orange-500 */
          .token.comment { color: rgb(100,116,139); font-style: italic; } /* slate-500 */
          .token.tag { color: rgb(244, 114, 182); }         /* pink-400 */
          .token.attr-name { color: rgb(45,212,191); }      /* teal-400 */
          .token.property { color: rgb(59,130,246); }       /* blue-500 */
          .token.function { color: rgb(56,189,248); }       /* sky-400 */
          .token.type { color: rgb(250,204,21); }           /* yellow-400 */
          .token.operator { color: rgb(226,232,240); }      /* slate-200 */
          .token.punctuation { color: rgb(148,163,184); }   /* slate-400 */
        `,
        }}
      />
    </div>
  );
}
