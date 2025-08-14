

import { useState, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CurvedArrow } from "@/components/ui/curved-arrow"
import { Play, Pause, RotateCcw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CodeBlock } from "@/components/code-block"

type Demo = {
  id: string
  title: string
  description: string
  config: {
    curveType: string
    variant?: string
    size?: string
    gradientFrom?: string
    gradientTo?: string
    strokeWidth?: number
  }
}

export function CurvedArrowDemo() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState<string>("smooth-glow")

  // Refs for all demos (start/end reused per preview)
  const startRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const demos: Demo[] = useMemo(
    () => [
      {
        id: "smooth-glow",
        title: "Smooth Glow",
        description: "Gradient bezier with glow",
        config: { curveType: "smooth", variant: "glow", size: "lg", gradientFrom: "#3b82f6", gradientTo: "#8b5cf6" },
      },
      {
        id: "elegant-xl",
        title: "Elegant XL",
        description: "Elegant curve, large stroke",
        config: {
          curveType: "elegant",
          variant: "glow",
          size: "xl",
          strokeWidth: 6,
          gradientFrom: "#06b6d4",
          gradientTo: "#3b82f6",
        },
      },
      {
        id: "heart-fire",
        title: "Heart Fire",
        description: "Heart-shaped, fiery",
        config: { curveType: "heart", variant: "fire", size: "xl", gradientFrom: "#ef4444", gradientTo: "#f97316" },
      },
      {
        id: "spiral-electric",
        title: "Spiral Electric",
        description: "Electric spiral",
        config: {
          curveType: "spiral",
          variant: "electric",
          size: "lg",
          gradientFrom: "#eab308",
          gradientTo: "#22c55e",
        },
      },
      {
        id: "zigzag-bold",
        title: "Zigzag Bold",
        description: "Bold edgy zigzags",
        config: { curveType: "zigzag", variant: "bold", size: "lg", gradientFrom: "#f472b6", gradientTo: "#a855f7" },
      },
      {
        id: "s-curve-rainbow",
        title: "S Curve Rainbow",
        description: "Playful rainbow",
        config: {
          curveType: "s-curve",
          variant: "rainbow",
          size: "lg",
          gradientFrom: "#ec4899",
          gradientTo: "#22d3ee",
        },
      },
      {
        id: "wave-neon",
        title: "Wave Neon",
        description: "Neon pulse",
        config: { curveType: "wave", variant: "neon", size: "lg", gradientFrom: "#22d3ee", gradientTo: "#a78bfa" },
      },
      {
        id: "dramatic-shadow",
        title: "Dramatic Shadow",
        description: "High intensity bend",
        config: {
          curveType: "dramatic",
          variant: "shadow",
          size: "lg",
          gradientFrom: "#f97316",
          gradientTo: "#fde047",
        },
      },
      {
        id: "obstacle-route",
        title: "Around Obstacle",
        description: "Smart routing",
        config: {
          curveType: "around-obstacle",
          variant: "subtle",
          size: "lg",
          gradientFrom: "#94a3b8",
          gradientTo: "#64748b",
        },
      },
      {
        id: "shortest-path",
        title: "Shortest Path",
        description: "Direct yet smooth",
        config: {
          curveType: "shortest-path",
          variant: "default",
          size: "lg",
          gradientFrom: "#22c55e",
          gradientTo: "#16a34a",
        },
      },
      {
        id: "elegant-neon",
        title: "Elegant Neon",
        description: "Electric elegant",
        config: {
          curveType: "elegant",
          variant: "electric",
          size: "lg",
          gradientFrom: "#60a5fa",
          gradientTo: "#22d3ee",
        },
      },
      {
        id: "smooth-subtle",
        title: "Smooth Subtle",
        description: "Minimal aesthetic",
        config: { curveType: "smooth", variant: "subtle", size: "lg", gradientFrom: "#94a3b8", gradientTo: "#e2e8f0" },
      },
    ],
    [],
  )

  const activeDemo = demos.find((d) => d.id === activeId) || demos[0]

  const code = `<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="${activeDemo.config.curveType}"
  variant="${activeDemo.config.variant || "default"}"
  size="${activeDemo.config.size || "default"}"
  animated={${isPlaying}}
  gradientFrom="${activeDemo.config.gradientFrom || "#888"}"
  gradientTo="${activeDemo.config.gradientTo || "#bbb"}"
  ${activeDemo.config.strokeWidth ? `strokeWidth={${activeDemo.config.strokeWidth}}` : ""}
/>`.replace(/\n\s*\n/g, "\n")

  const filtered = demos.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase()) ||
      d.config.curveType.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Interactive Demo
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See It In Action</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore a growing library of presets. Click a card to preview and copy code.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Controls, Search, Preset Grid */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>Play, pause or rotate presets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant={isPlaying ? "default" : "outline"}
                    onClick={() => setIsPlaying((p) => !p)}
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const idx = filtered.findIndex((d) => d.id === activeId)
                      const next = filtered[(idx + 1) % filtered.length]?.id || filtered[0].id
                      setActiveId(next)
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Next
                  </Button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search presets (e.g. wave, neon, subtle)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveId(d.id)}
                  className={`text-left p-4 rounded-lg border transition-all hover:shadow-sm ${
                    activeId === d.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{d.title}</h4>
                      <p className="text-xs text-muted-foreground">{d.description}</p>
                    </div>
                    {activeId === d.id && <Badge>Active</Badge>}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {d.config.curveType} · {d.config.variant || "default"} · {d.config.size || "default"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Live Preview + Code */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{activeDemo.title}</CardTitle>
                <CardDescription>{activeDemo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-80 sm:h-96 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 rounded-lg overflow-hidden">
                  <div
                    ref={startRef}
                    className="absolute top-12 left-8 w-16 h-12 sm:w-20 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  >
                    Start
                  </div>
                  <div
                    ref={endRef}
                    className="absolute bottom-12 right-8 w-16 h-12 sm:w-20 sm:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  >
                    End
                  </div>

                  <CurvedArrow
                    startElement={startRef}
                    endElement={endRef}
                    curveType={activeDemo.config.curveType as any}
                    variant={(activeDemo.config.variant || "default") as any}
                    size={(activeDemo.config.size || "default") as any}
                    animated={isPlaying}
                    gradientFrom={activeDemo.config.gradientFrom}
                    gradientTo={activeDemo.config.gradientTo}
                    strokeWidth={activeDemo.config.strokeWidth}
                    showEndArrow={true}
                    endArrowShape="filled-triangle"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Code Example</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock code={code} language="tsx" filename="Demo.tsx" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
