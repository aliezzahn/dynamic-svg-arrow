"use client"

import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CurvedArrow } from "@/components/ui/curved-arrow"

export function CurvedArrowExamples() {
  // Refs for different examples
  const flowchartRefs = {
    start: useRef<HTMLDivElement>(null),
    process: useRef<HTMLDivElement>(null),
    decision: useRef<HTMLDivElement>(null),
    end: useRef<HTMLDivElement>(null),
  }

  const uiRefs = {
    tooltip: useRef<HTMLDivElement>(null),
    button: useRef<HTMLDivElement>(null),
    feature1: useRef<HTMLDivElement>(null),
    feature2: useRef<HTMLDivElement>(null),
    feature3: useRef<HTMLDivElement>(null),
  }

  const diagramRefs = {
    node1: useRef<HTMLDivElement>(null),
    node2: useRef<HTMLDivElement>(null),
    node3: useRef<HTMLDivElement>(null),
    node4: useRef<HTMLDivElement>(null),
  }

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Use Cases
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Real-World Examples
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            See how curved arrows enhance different types of applications and user interfaces
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Flowchart Example */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Process Flowchart
              </CardTitle>
              <CardDescription>
                Connect process steps with intelligent routing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4">
                <div
                  ref={flowchartRefs.start}
                  className="absolute top-4 left-4 w-16 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  Start
                </div>
                
                <div
                  ref={flowchartRefs.process}
                  className="absolute top-16 right-4 w-20 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                >
                  Process
                </div>
                
                <div
                  ref={flowchartRefs.decision}
                  className="absolute bottom-16 left-8 w-18 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-xs font-bold transform rotate-45"
                >
                  <span className="transform -rotate-45">Check</span>
                </div>
                
                <div
                  ref={flowchartRefs.end}
                  className="absolute bottom-4 right-8 w-16 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  End
                </div>

                <CurvedArrow
                  startElement={flowchartRefs.start}
                  endElement={flowchartRefs.process}
                  curveType="smooth"
                  variant="default"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                />
                
                <CurvedArrow
                  startElement={flowchartRefs.process}
                  endElement={flowchartRefs.decision}
                  curveType="s-curve"
                  variant="default"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                />
                
                <CurvedArrow
                  startElement={flowchartRefs.decision}
                  endElement={flowchartRefs.end}
                  curveType="elegant"
                  variant="default"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* UI Onboarding Example */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                UI Onboarding
              </CardTitle>
              <CardDescription>
                Guide users through your interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg p-4">
                <div
                  ref={uiRefs.tooltip}
                  className="absolute top-4 left-4 w-24 h-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg border flex items-center justify-center text-xs font-medium"
                >
                  Welcome! 👋
                </div>
                
                <div
                  ref={uiRefs.button}
                  className="absolute top-8 right-8 w-20 h-8 bg-purple-500 rounded-md flex items-center justify-center text-white text-xs font-bold"
                >
                  Click me
                </div>
                
                <div
                  ref={uiRefs.feature1}
                  className="absolute bottom-20 left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                >
                  Step 1
                </div>
                
                <div
                  ref={uiRefs.feature2}
                  className="absolute bottom-20 center w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                >
                  Step 2
                </div>
                
                <div
                  ref={uiRefs.feature3}
                  className="absolute bottom-20 right-4 w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                >
                  Step 3
                </div>

                <CurvedArrow
                  startElement={uiRefs.tooltip}
                  endElement={uiRefs.button}
                  curveType="smooth"
                  variant="glow"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                  endArrowShape="filled-triangle"
                />
                
                <CurvedArrow
                  startElement={uiRefs.feature1}
                  endElement={uiRefs.feature2}
                  curveType="wave"
                  variant="subtle"
                  size="xs"
                  animated={true}
                  showEndArrow={true}
                />
                
                <CurvedArrow
                  startElement={uiRefs.feature2}
                  endElement={uiRefs.feature3}
                  curveType="wave"
                  variant="subtle"
                  size="xs"
                  animated={true}
                  showEndArrow={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Network Diagram Example */}
          <Card className="col-span-1 lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Network Diagram
              </CardTitle>
              <CardDescription>
                Visualize complex relationships and connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 rounded-lg p-4">
                <div
                  ref={diagramRefs.node1}
                  className="absolute top-8 left-8 w-12 h-12 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  A
                </div>
                
                <div
                  ref={diagramRefs.node2}
                  className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  B
                </div>
                
                <div
                  ref={diagramRefs.node3}
                  className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  C
                </div>
                
                <div
                  ref={diagramRefs.node4}
                  className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  D
                </div>

                <CurvedArrow
                  startElement={diagramRefs.node1}
                  endElement={diagramRefs.node2}
                  curveType="smooth"
                  variant="emerald"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                  showStartArrow={true}
                />
                
                <CurvedArrow
                  startElement={diagramRefs.node1}
                  endElement={diagramRefs.node3}
                  curveType="elegant"
                  variant="teal"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                />
                
                <CurvedArrow
                  startElement={diagramRefs.node2}
                  endElement={diagramRefs.node4}
                  curveType="s-curve"
                  variant="cyan"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                />
                
                <CurvedArrow
                  startElement={diagramRefs.node3}
                  endElement={diagramRefs.node4}
                  curveType="smooth"
                  variant="lime"
                  size="sm"
                  animated={true}
                  showEndArrow={true}
                  showStartArrow={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Examples Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Data Flow</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Visualize data pipelines and transformations
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">User Journey</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Map user interactions and experiences
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Tutorials</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Create interactive learning experiences
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Architecture</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Document system architecture and components
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
