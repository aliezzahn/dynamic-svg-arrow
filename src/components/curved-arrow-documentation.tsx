"use client"

// Deprecated: moved to /docs page. This component is no longer used.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export function CurvedArrowDocumentation() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Documentation
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Getting Started
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know to integrate curved arrows into your React application
          </p>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="installation" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="installation">Installation</TabsTrigger>
              <TabsTrigger value="basic-usage">Basic Usage</TabsTrigger>
              <TabsTrigger value="props">Props</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="installation" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>NPM Installation</CardTitle>
                    <CardDescription>Install the package using your preferred package manager</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">npm</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("npm install curved-arrow-react")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>npm install curved-arrow-react</code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">yarn</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("yarn add curved-arrow-react")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>yarn add curved-arrow-react</code>
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">pnpm</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("pnpm add curved-arrow-react")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>pnpm add curved-arrow-react</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Import Statement</CardTitle>
                    <CardDescription>Import the component into your React application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ES6 Import</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("import { CurvedArrow } from 'curved-arrow-react'")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>import {"{ CurvedArrow }"} from 'curved-arrow-react'</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="basic-usage" className="mt-8">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Example</CardTitle>
                    <CardDescription>A simple curved arrow connecting two elements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">React Component</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(`import React, { useRef } from 'react'
import { CurvedArrow } from 'curved-arrow-react'

function MyComponent() {
  const startRef = useRef(null)
  const endRef = useRef(null)

  return (
    <div className="relative">
      <div ref={startRef} className="w-20 h-12 bg-blue-500 rounded">
        Start
      </div>
      
      <div ref={endRef} className="w-20 h-12 bg-green-500 rounded">
        End
      </div>

      <CurvedArrow
        startElement={startRef}
        endElement={endRef}
        curveType="smooth"
        animated={true}
        showEndArrow={true}
      />
    </div>
  )
}`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{`import React, { useRef } from 'react'
import { CurvedArrow } from 'curved-arrow-react'

function MyComponent() {
  const startRef = useRef(null)
  const endRef = useRef(null)

  return (
    <div className="relative">
      <div ref={startRef} className="w-20 h-12 bg-blue-500 rounded">
        Start
      </div>
      
      <div ref={endRef} className="w-20 h-12 bg-green-500 rounded">
        End
      </div>

      <CurvedArrow
        startElement={startRef}
        endElement={endRef}
        curveType="smooth"
        animated={true}
        showEndArrow={true}
      />
    </div>
  )
}`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Static Coordinates</CardTitle>
                    <CardDescription>Use static coordinates instead of element references</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Static Example</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(`<CurvedArrow
  startX={50}
  startY={50}
  endX={300}
  endY={200}
  curveType="heart"
  variant="fire"
  animated={true}
  showEndArrow={true}
/>`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{`<CurvedArrow
  startX={50}
  startY={50}
  endX={300}
  endY={200}
  curveType="heart"
  variant="fire"
  animated={true}
  showEndArrow={true}
/>`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="props" className="mt-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Core Props</CardTitle>
                    <CardDescription>Essential properties for basic functionality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Prop</th>
                            <th className="text-left p-2 font-medium">Type</th>
                            <th className="text-left p-2 font-medium">Default</th>
                            <th className="text-left p-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b">
                            <td className="p-2 font-mono">startElement</td>
                            <td className="p-2">RefObject&lt;HTMLElement&gt;</td>
                            <td className="p-2">-</td>
                            <td className="p-2">Reference to the start element</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">endElement</td>
                            <td className="p-2">RefObject&lt;HTMLElement&gt;</td>
                            <td className="p-2">-</td>
                            <td className="p-2">Reference to the end element</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">startX</td>
                            <td className="p-2">number</td>
                            <td className="p-2">0</td>
                            <td className="p-2">Static start X coordinate</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">startY</td>
                            <td className="p-2">number</td>
                            <td className="p-2">0</td>
                            <td className="p-2">Static start Y coordinate</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">endX</td>
                            <td className="p-2">number</td>
                            <td className="p-2">100</td>
                            <td className="p-2">Static end X coordinate</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">endY</td>
                            <td className="p-2">number</td>
                            <td className="p-2">100</td>
                            <td className="p-2">Static end Y coordinate</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Curve Configuration</CardTitle>
                    <CardDescription>Properties to control the curve appearance and behavior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Prop</th>
                            <th className="text-left p-2 font-medium">Type</th>
                            <th className="text-left p-2 font-medium">Default</th>
                            <th className="text-left p-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b">
                            <td className="p-2 font-mono">curveType</td>
                            <td className="p-2">string</td>
                            <td className="p-2">"smooth"</td>
                            <td className="p-2">Type of curve (smooth, heart, spiral, etc.)</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">curveIntensity</td>
                            <td className="p-2">number</td>
                            <td className="p-2">0.4</td>
                            <td className="p-2">Intensity of the curve (0.1 - 2.0)</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">curveDirection</td>
                            <td className="p-2">string</td>
                            <td className="p-2">"auto"</td>
                            <td className="p-2">Direction of curve (auto, up, down, left, right)</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">variant</td>
                            <td className="p-2">string</td>
                            <td className="p-2">"default"</td>
                            <td className="p-2">Visual variant (glow, neon, fire, etc.)</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">size</td>
                            <td className="p-2">string</td>
                            <td className="p-2">"default"</td>
                            <td className="p-2">Size variant (xs, sm, default, lg, xl, etc.)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Arrow Head Configuration</CardTitle>
                    <CardDescription>Properties to customize arrow heads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Prop</th>
                            <th className="text-left p-2 font-medium">Type</th>
                            <th className="text-left p-2 font-medium">Default</th>
                            <th className="text-left p-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b">
                            <td className="p-2 font-mono">showStartArrow</td>
                            <td className="p-2">boolean</td>
                            <td className="p-2">false</td>
                            <td className="p-2">Show arrow head at start</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">showEndArrow</td>
                            <td className="p-2">boolean</td>
                            <td className="p-2">true</td>
                            <td className="p-2">Show arrow head at end</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">startArrowShape</td>
                            <td className="p-2">string</td>
                            <td className="p-2">"triangle"</td>
                            <td className="p-2">Shape of start arrow head</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">endArrowShape</td>
                            <td className="p-2">string</td>
                            <td className="p-2">"triangle"</td>
                            <td className="p-2">Shape of end arrow head</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-mono">arrowSize</td>
                            <td className="p-2">number</td>
                            <td className="p-2">20</td>
                            <td className="p-2">Size of arrow heads in pixels</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Styling</CardTitle>
                    <CardDescription>Custom colors, gradients, and effects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gradient Arrow</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="elegant"
  variant="glow"
  size="xl"
  gradientFrom="#ff6b6b"
  gradientTo="#4ecdc4"
  animated={true}
  showEndArrow={true}
  endArrowShape="filled-triangle"
/>`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="elegant"
  variant="glow"
  size="xl"
  gradientFrom="#ff6b6b"
  gradientTo="#4ecdc4"
  animated={true}
  showEndArrow={true}
  endArrowShape="filled-triangle"
/>`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Obstacle Avoidance</CardTitle>
                    <CardDescription>Arrows that route around obstacles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Smart Routing</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  obstacleElements={[obstacleRef1, obstacleRef2]}
  curveType="around-obstacle"
  variant="default"
  animated={true}
  showEndArrow={true}
/>`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  obstacleElements={[obstacleRef1, obstacleRef2]}
  curveType="around-obstacle"
  variant="default"
  animated={true}
  showEndArrow={true}
/>`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mathematical Curves</CardTitle>
                    <CardDescription>Fibonacci, sine waves, and other mathematical functions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Fibonacci Spiral</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="fibonacci"
  variant="cosmic"
  size="lg"
  curveIntensity={1.2}
  animated={true}
  showEndArrow={true}
  endArrowShape="star"
/>`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="fibonacci"
  variant="cosmic"
  size="lg"
  curveIntensity={1.2}
  animated={true}
  showEndArrow={true}
  endArrowShape="star"
/>`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Custom Animation</CardTitle>
                    <CardDescription>Control animation timing and direction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Custom Timing</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="wave"
  variant="electric"
  animated={true}
  animationDuration="4s"
  animationDirection="alternate"
  animationDelay="0.5s"
  showEndArrow={true}
/>`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{`<CurvedArrow
  startElement={startRef}
  endElement={endRef}
  curveType="wave"
  variant="electric"
  animated={true}
  animationDuration="4s"
  animationDirection="alternate"
  animationDelay="0.5s"
  showEndArrow={true}
/>`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
