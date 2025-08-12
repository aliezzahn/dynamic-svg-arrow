/**
 * CurvedArrow
 *
 * A highly-flexible, DOM-aware SVG connector for drawing animated, curved arrows
 * between two elements or coordinates. Supports gradient strokes, multiple curve
 * styles, head shapes, obstacle avoidance, and two-layer rendering for correct
 * z-index stacking relative to page content.
 *
 * Coordinate system and container
 * - This component renders two absolutely positioned containers (UNDER and OVER)
 *   as siblings at the same DOM level, each with inset-0. They should be mounted
 *   inside a relatively positioned parent (e.g. className="relative") so the
 *   arrows align to that box.
 * - All geometry (start/end points, obstacles) are calculated relative to the
 *   UNDER container's boundingClientRect, which (when inset-0) matches the
 *   parent container's rect.
 *
 * Layering (z-index contract)
 * - Elements (your draggable boxes, etc.) should be placed in either:
 *   - z-1: "Under arrow" elements
 *   - z-5: "Over arrow" elements
 * - The arrow renders in two sibling layers:
 *   - z-2: UNDER layer (base line + any heads configured to "under")
 *   - z-4: OVER layer (heads configured to "over" + optional overlays)
 * This guarantees:
 *   - "Under" elements sit below the entire arrow (base line and any under-heads).
 *   - Heads marked "over" appear above "under" elements but below "over" elements.
 *   - "Over" elements always sit on top of the arrow.
 *
 * Accessibility
 * - The UNDER layer container has role="img" and an aria-label describing the connector.
 * - The OVER layer is aria-hidden since it only contributes head overlays by design.
 *
 * Performance
 * - Uses ResizeObserver and MutationObserver to track geometry changes of the start,
 *   end, and obstacle elements.
 * - Batches updates via requestAnimationFrame and avoids state churn when geometry
 *   deltas are insignificant.
 *
 * Usage (basic)
 *   const aRef = useRef<HTMLDivElement>(null)
 *   const bRef = useRef<HTMLDivElement>(null)
 *   return (
 *     <div className="relative">
 *       <div ref={aRef} className="z-1">A</div>
 *       <div ref={bRef} className="z-5">B</div>
 *       <CurvedArrow startElement={aRef} endElement={bRef} />
 *     </div>
 *   )
 *
 * Notes
 * - If you don't use startElement/endElement refs, you can render by coordinates using
 *   startX/startY/endX/endY instead.
 * - For obstacle avoidance, pass obstacleElements as an array of refs. A simple
 *   heuristic path will be produced when curveType is "around-obstacle" or "shortest-path".
 */

"use client"

import * as React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

/**
 * Variants for styling the arrow container with Tailwind classes.
 * Note: These classes apply to the wrapper that contains <svg> layers.
 */
const curvedArrowVariants = cva("absolute inset-0 pointer-events-none", {
  variants: {
    variant: {
      default: "drop-shadow-md",
      glow: "drop-shadow-[0_4px_12px_rgba(133,45,238,0.3)]",
      subtle: "drop-shadow-sm opacity-80",
      bold: "drop-shadow-lg",
      neon: "drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]",
      fire: "drop-shadow-[0_0_15px_rgba(255,69,0,0.8)]",
      ice: "drop-shadow-[0_0_12px_rgba(173,216,230,0.7)]",
      electric: "drop-shadow-[0_0_18px_rgba(255,255,0,0.6)]",
      shadow: "drop-shadow-[4px_4px_8px_rgba(0,0,0,0.3)]",
      rainbow: "drop-shadow-[0_0_10px_rgba(255,0,255,0.4)]",
      cosmic: "drop-shadow-[0_0_25px_rgba(138,43,226,0.5)]",
      emerald: "drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]",
      rose: "drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]",
      amber: "drop-shadow-[0_0_14px_rgba(245,158,11,0.6)]",
      violet: "drop-shadow-[0_0_16px_rgba(139,92,246,0.5)]",
      cyan: "drop-shadow-[0_0_13px_rgba(6,182,212,0.6)]",
      lime: "drop-shadow-[0_0_11px_rgba(132,204,22,0.5)]",
      pink: "drop-shadow-[0_0_17px_rgba(236,72,153,0.6)]",
      indigo: "drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]",
      teal: "drop-shadow-[0_0_12px_rgba(20,184,166,0.6)]",
      orange: "drop-shadow-[0_0_14px_rgba(249,115,22,0.5)]",
      slate: "drop-shadow-[0_0_10px_rgba(100,116,139,0.4)]",
    },
    size: {
      xs: "[&_path]:stroke-[1px]",
      sm: "[&_path]:stroke-[2px]",
      default: "[&_path]:stroke-[4px]",
      lg: "[&_path]:stroke-[6px]",
      xl: "[&_path]:stroke-[8px]",
      "2xl": "[&_path]:stroke-[10px]",
      "3xl": "[&_path]:stroke-[12px]",
      "4xl": "[&_path]:stroke-[14px]",
      "5xl": "[&_path]:stroke-[16px]",
      "6xl": "[&_path]:stroke-[18px]",
      "7xl": "[&_path]:stroke-[20px]",
      "8xl": "[&_path]:stroke-[22px]",
      "9xl": "[&_path]:stroke-[24px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

/**
 * Bounding rectangle for obstacles, measured relative to the canvas/container.
 */
type RectLite = { x: number; y: number; width: number; height: number }

/**
 * Component props for CurvedArrow.
 *
 * Most props are optional with sensible defaults. You can either:
 * - Provide element refs (startElement, endElement) with position docking via startPosition/endPosition; or
 * - Provide absolute coordinates (startX, startY, endX, endY).
 */
export interface CurvedArrowProps extends VariantProps<typeof curvedArrowVariants> {
  /**
   * Reference to the element used as the start anchor.
   * When provided, startX/startY are ignored and computed from this element using startPosition.
   */
  startElement?: React.RefObject<HTMLElement>
  /**
   * Reference to the element used as the end anchor.
   * When provided, endX/endY are ignored and computed from this element using endPosition.
   */
  endElement?: React.RefObject<HTMLElement>

  /**
   * Optional array of obstacle element refs. When present and curveType is
   * "around-obstacle" or "shortest-path", a basic waypoint path is calculated
   * to detour around these obstacles.
   */
  obstacleElements?: React.RefObject<HTMLElement>[]

  /**
   * Absolute start X coordinate (used if startElement is not provided).
   */
  startX?: number
  /**
   * Absolute start Y coordinate (used if startElement is not provided).
   */
  startY?: number
  /**
   * Absolute end X coordinate (used if endElement is not provided).
   */
  endX?: number
  /**
   * Absolute end Y coordinate (used if endElement is not provided).
   */
  endY?: number

  /**
   * Docking position for startElement (applies padding to sit just outside the element).
   * Examples: "top", "right-center", "center-bottom", etc.
   */
  startPosition?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
    | "left-center"
    | "right-center"
    | "middle-left"
    | "middle-right"
    | "middle-top"
    | "middle-bottom"
    | "center-left"
    | "center-right"
    | "center-top"
    | "center-bottom"

  /**
   * Docking position for endElement (applies padding to sit just outside the element).
   */
  endPosition?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
    | "left-center"
    | "right-center"
    | "middle-left"
    | "middle-right"
    | "middle-top"
    | "middle-bottom"
    | "center-left"
    | "center-right"
    | "center-top"
    | "center-bottom"

  /**
   * Intensity of curvature (0..1+). Higher values bow further.
   * Default: 0.4
   */
  curveIntensity?: number
  /**
   * Curve style preset controlling control points/segments.
   * Default: "smooth"
   */
  curveType?:
    | "smooth"
    | "dramatic"
    | "s-curve"
    | "wave"
    | "spiral" // reserved for future implementation
    | "elegant"
    | "around-obstacle"
    | "shortest-path"
    | "zigzag"
    | "loop" // reserved for future implementation
    | "heart" // reserved for future implementation
    | "infinity" // reserved for future implementation
  /**
   * Directional bias for control points. When "auto", chooses based on relative deltas.
   * Default: "auto"
   */
  curveDirection?: "up" | "down" | "left" | "right" | "auto"

  /**
   * Base stroke width for the main path (not including any glow).
   * Default: 4
   */
  strokeWidth?: number
  /**
   * Base size for arrowheads when startArrowSize/endArrowSize are not provided.
   * Default: 20
   */
  arrowSize?: number
  /**
   * Solid color used when gradientFrom/gradientTo are not set.
   * Default: "#852DEE"
   */
  color?: string
  /**
   * Start of linear gradient color; when both gradientFrom and gradientTo are defined,
   * the arrow will be stroked by a gradient instead of solid color.
   * Default: "#ffffff"
   */
  gradientFrom?: string
  /**
   * End of linear gradient color.
   * Default: "#852DEE"
   */
  gradientTo?: string

  /**
   * Toggle visibility of the start arrowhead.
   * Default: false
   */
  showStartArrow?: boolean
  /**
   * Toggle visibility of the end arrowhead.
   * Default: true
   */
  showEndArrow?: boolean

  /**
   * Shape preset for start arrowhead.
   * Default: "triangle"
   */
  startArrowShape?:
    | "triangle"
    | "circle"
    | "square"
    | "diamond"
    | "star"
    | "heart"
    | "cross"
    | "plus"
    | "chevron"
    | "double-chevron"
    | "arrow"
    | "hollow-triangle"
    | "hollow-circle"
    | "hollow-square"
    | "hollow-diamond"
    | "filled-circle"
    | "filled-square"
    | "filled-diamond"
    | "filled-triangle"
    | "line"
    | "dot"
    | "dash"

  /**
   * Shape preset for end arrowhead.
   * Default: "triangle"
   */
  endArrowShape?:
    | "triangle"
    | "circle"
    | "square"
    | "diamond"
    | "star"
    | "heart"
    | "cross"
    | "plus"
    | "chevron"
    | "double-chevron"
    | "arrow"
    | "hollow-triangle"
    | "hollow-circle"
    | "hollow-square"
    | "hollow-diamond"
    | "filled-circle"
    | "filled-square"
    | "filled-diamond"
    | "filled-triangle"
    | "line"
    | "dot"
    | "dash"

  /**
   * Additional rotation to apply to the start arrowhead, in degrees.
   * Default: 0
   */
  startArrowRotation?: number
  /**
   * Additional rotation to apply to the end arrowhead, in degrees.
   * Default: 0
   */
  endArrowRotation?: number

  /**
   * Override size for the start arrowhead (falls back to arrowSize).
   */
  startArrowSize?: number
  /**
   * Override size for the end arrowhead (falls back to arrowSize).
   */
  endArrowSize?: number

  /**
   * When true, fill the start arrowhead with the stroke color/gradient.
   * Default: false
   */
  startArrowFilled?: boolean
  /**
   * When true, fill the end arrowhead with the stroke color/gradient.
   * Default: false
   */
  endArrowFilled?: boolean

  /**
   * Per-head stroke color overrides (falls back to gradient or color).
   */
  startArrowStrokeColor?: string
  endArrowStrokeColor?: string
  /**
   * Per-head fill color overrides (falls back to gradient or color when filled).
   */
  startArrowFillColor?: string
  endArrowFillColor?: string

  /**
   * Per-head stroke widths (falls back to strokeWidth).
   */
  startArrowStrokeWidth?: number
  endArrowStrokeWidth?: number

  /**
   * Per-head opacity (0..1).
   */
  startArrowOpacity?: number
  endArrowOpacity?: number

  /**
   * Layer on which to render the start arrowhead.
   * "under" = in the UNDER SVG, "over" = in the OVER SVG.
   * Default: "over"
   */
  startHeadLayer?: "under" | "over"
  /**
   * Layer on which to render the end arrowhead.
   * Default: "over"
   */
  endHeadLayer?: "under" | "over"

  /**
   * If true and the head is on the same layer as the line, draw a short overlay segment
   * so the line visually overlaps the head for a cleaner look.
   * Default: false
   */
  startLineOverHead?: boolean
  endLineOverHead?: boolean

  /**
   * Enable white animated dash overlay on the main path.
   * Default: true
   */
  animated?: boolean
  /**
   * CSS time for one dash cycle (e.g., "2s").
   * Default: "2s"
   */
  animationDuration?: string
  /**
   * CSS delay before animation starts (e.g., "0.3s").
   * Default: "0s"
   */
  animationDelay?: string
  /**
   * Animation direction mode.
   * Default: "forward"
   */
  animationDirection?: "forward" | "reverse" | "alternate" | "alternate-reverse"

  /**
   * Accessible label applied to the UNDER container (role="img").
   * Default: "Curved arrow connector"
   */
  ariaLabel?: string

  /**
   * Additional className merged into the container class variants.
   */
  className?: string
}

/**
 * Build an SVG path string for an arrowhead centered at (x, y).
 *
 * @param x - Head tip X coordinate.
 * @param y - Head tip Y coordinate.
 * @param angle - Base direction angle (radians) for the head tip orientation.
 * @param size - Base size of the head.
 * @param shape - Named shape preset.
 * @param rotation - Additional rotation in degrees applied around (x, y).
 * @param forceFilled - When true, some outlines become closed fills for better visuals.
 * @returns An SVG path "d" string describing the head geometry.
 */
const createArrowHead = (
  x: number,
  y: number,
  angle: number,
  size: number,
  shape: string,
  rotation = 0,
  forceFilled = false,
) => {
  const totalAngle = angle + (rotation * Math.PI) / 180
  const cos = Math.cos(totalAngle)
  const sin = Math.sin(totalAngle)

  // When forceFilled is true and shape is typically stroked, create a filled triangle shell.
  if (forceFilled && (shape === "triangle" || shape === "arrow" || shape === "hollow-triangle")) {
    const a = Math.PI / 6
    const fx1 = x - size * Math.cos(totalAngle - a)
    const fy1 = y - size * Math.sin(totalAngle - a)
    const fx2 = x - size * Math.cos(totalAngle + a)
    const fy2 = y - size * Math.sin(totalAngle + a)
    return `M ${x} ${y} L ${fx1} ${fy1} L ${fx2} ${fy2} Z`
  }

  // Shape presets. Many outline shapes rely on stroke attributes from the caller.
  switch (shape) {
    case "triangle":
    case "arrow": {
      const a = Math.PI / 6
      const x1 = x - size * Math.cos(totalAngle - a)
      const y1 = y - size * Math.sin(totalAngle - a)
      const x2 = x - size * Math.cos(totalAngle + a)
      const y2 = y - size * Math.sin(totalAngle + a)
      return `M ${x} ${y} L ${x1} ${y1} M ${x} ${y} L ${x2} ${y2}`
    }
    case "filled-triangle": {
      const a = Math.PI / 6
      const fx1 = x - size * Math.cos(totalAngle - a)
      const fy1 = y - size * Math.sin(totalAngle - a)
      const fx2 = x - size * Math.cos(totalAngle + a)
      const fy2 = y - size * Math.sin(totalAngle + a)
      return `M ${x} ${y} L ${fx1} ${fy1} L ${fx2} ${fy2} Z`
    }
    case "circle":
    case "filled-circle":
      return `M ${x + size * cos} ${y + size * sin} A ${size} ${size} 0 1 1 ${x - size * cos} ${y - size * sin} A ${size} ${size} 0 1 1 ${x + size * cos} ${y + size * sin}`
    case "hollow-circle": {
      const r = size * 0.6
      return `M ${x + size * cos} ${y + size * sin} A ${size} ${size} 0 1 1 ${x - size * cos} ${y - size * sin} A ${size} ${size} 0 1 1 ${x + size * cos} ${y + size * sin} M ${x + r * cos} ${y + r * sin} A ${r} ${r} 0 1 0 ${x - r * cos} ${y - r * sin} A ${r} ${r} 0 1 0 ${x + r * cos} ${y + r * sin}`
    }
    case "square":
    case "filled-square": {
      const h = size * 0.7
      const pts = [
        [x + h * cos - h * sin, y + h * sin + h * cos],
        [x + h * cos + h * sin, y + h * sin - h * cos],
        [x - h * cos + h * sin, y - h * sin - h * cos],
        [x - h * cos - h * sin, y - h * sin + h * cos],
      ]
      return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]} L ${pts[3][0]} ${pts[3][1]} Z`
    }
    case "diamond":
    case "filled-diamond": {
      const d = size * 0.8
      return `M ${x + d * cos} ${y + d * sin} L ${x + d * sin} ${y - d * cos} L ${x - d * cos} ${y - d * sin} L ${x - d * sin} ${y + d * cos} Z`
    }
    case "star": {
      let p = ""
      const outer = size
      const inner = size * 0.4
      for (let i = 0; i < 10; i++) {
        const ang = totalAngle + (i * Math.PI) / 5
        const r = i % 2 === 0 ? outer : inner
        const px = x + r * Math.cos(ang)
        const py = y + r * Math.sin(ang)
        p += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`
      }
      return p + " Z"
    }
    case "heart": {
      const s = size * 0.6
      const hx1 = x - s * 0.5 * cos + s * 0.8 * sin
      const hy1 = y - s * 0.5 * sin - s * 0.8 * cos
      const hx2 = x + s * 0.5 * cos + s * 0.8 * sin
      const hy2 = y + s * 0.5 * sin - s * 0.8 * cos
      return `M ${x} ${y} C ${hx1} ${hy1} ${x - s * cos} ${y - s * sin} ${x - s * 0.5 * cos} ${y - s * 0.5 * sin} C ${x} ${y - s * sin} ${x + s * 0.5 * cos} ${y + s * 0.5 * sin} ${x + s * cos} ${y + s * sin} C ${hx2} ${hy2} ${x} ${y} ${x} ${y}`
    }
    case "cross": {
      const s = size * 0.8
      return `M ${x - s * cos} ${y - s * sin} L ${x + s * cos} ${y + s * sin} M ${x - s * sin} ${y + s * cos} L ${x + s * sin} ${y - s * cos}`
    }
    case "plus": {
      const s = size * 0.8
      return `M ${x - s * cos} ${y - s * sin} L ${x + s * cos} ${y + s * sin} M ${x} ${y - s} L ${x} ${y + s}`
    }
    case "chevron": {
      const c = size * 0.8
      const x1 = x - c * Math.cos(totalAngle - Math.PI / 4)
      const y1 = y - c * Math.sin(totalAngle - Math.PI / 4)
      const x2 = x - c * Math.cos(totalAngle + Math.PI / 4)
      const y2 = y - c * Math.sin(totalAngle + Math.PI / 4)
      return `M ${x1} ${y1} L ${x} ${y} L ${x2} ${y2}`
    }
    case "double-chevron": {
      const c = size * 0.6
      const x1 = x - c * Math.cos(totalAngle - Math.PI / 4)
      const y1 = y - c * Math.sin(totalAngle - Math.PI / 4)
      const x2 = x - c * Math.cos(totalAngle + Math.PI / 4)
      const y2 = y - c * Math.sin(totalAngle + Math.PI / 4)
      const x3 = x - c * 1.6 * Math.cos(totalAngle - Math.PI / 4)
      const y3 = y - c * 1.6 * Math.sin(totalAngle - Math.PI / 4)
      const x4 = x - c * 1.6 * Math.cos(totalAngle + Math.PI / 4)
      const y4 = y - c * 1.6 * Math.sin(totalAngle + Math.PI / 4)
      const cx = x - c * 0.8 * Math.cos(totalAngle)
      const cy = y - c * 0.8 * Math.sin(totalAngle)
      return `M ${x1} ${y1} L ${x} ${y} L ${x2} ${y2} M ${x3} ${y3} L ${cx} ${cy} L ${x4} ${y4}`
    }
    case "line": {
      const s = size * 0.8
      const lx1 = x - s * sin
      const ly1 = y + s * cos
      const lx2 = x + s * sin
      const ly2 = y - s * cos
      return `M ${lx1} ${ly1} L ${lx2} ${ly2}`
    }
    case "dot": {
      const r = size * 0.3
      return `M ${x + r} ${y} A ${r} ${r} 0 1 1 ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y}`
    }
    case "dash": {
      const s = size * 0.6
      const dx1 = x - s * Math.cos(totalAngle)
      const dy1 = y - s * Math.sin(totalAngle)
      const dx2 = x + s * Math.cos(totalAngle)
      const dy2 = y + s * Math.sin(totalAngle)
      return `M ${dx1} ${dy1} L ${dx2} ${dy2}`
    }
    default: {
      // Fallback: simple open triangle.
      const a = Math.PI / 6
      const x1 = x - size * Math.cos(totalAngle - a)
      const y1 = y - size * Math.sin(totalAngle - a)
      const x2 = x - size * Math.cos(totalAngle + a)
      const y2 = y - size * Math.sin(totalAngle + a)
      return `M ${x} ${y} L ${x1} ${y1} M ${x} ${y} L ${x2} ${y2}`
    }
  }
}

/**
 * CurvedArrow
 *
 * Renders two sibling containers (UNDER and OVER) to solve stacking-context issues
 * with z-index. The UNDER container hosts the main path and any heads set to "under".
 * The OVER container hosts any heads set to "over" and optional local overlays.
 */
const CurvedArrow = React.forwardRef<HTMLDivElement, CurvedArrowProps>(
  (
    {
      startElement,
      endElement,
      obstacleElements = [],
      startX = 0,
      startY = 0,
      endX = 100,
      endY = 100,
      startPosition = "center",
      endPosition = "center",

      curveIntensity = 0.4,
      curveType = "smooth",
      curveDirection = "auto",

      strokeWidth = 4,
      arrowSize = 20,
      color = "#852DEE",
      gradientFrom = "#ffffff",
      gradientTo = "#852DEE",

      showStartArrow = false,
      showEndArrow = true,
      startArrowShape = "triangle",
      endArrowShape = "triangle",
      startArrowRotation = 0,
      endArrowRotation = 0,
      startArrowSize,
      endArrowSize,

      startArrowFilled = false,
      endArrowFilled = false,

      startArrowStrokeColor,
      startArrowFillColor,
      startArrowStrokeWidth,
      startArrowOpacity,
      endArrowStrokeColor,
      endArrowFillColor,
      endArrowStrokeWidth,
      endArrowOpacity,

      startHeadLayer = "over",
      endHeadLayer = "over",

      startLineOverHead = false,
      endLineOverHead = false,

      animated = true,
      animationDuration = "2s",
      animationDelay = "0s",
      animationDirection = "forward",

      ariaLabel = "Curved arrow connector",
      variant,
      size,
      className,
    },
    _ref,
  ) => {
    /**
     * Coordinates and obstacle rects, expressed relative to the container.
     * This state is updated when refs move/resize or when direct coordinates change.
     */
    const [coordinates, setCoordinates] = useState<{
      startX: number
      startY: number
      endX: number
      endY: number
      obstacleRects: RectLite[]
    }>({
      startX,
      startY,
      endX,
      endY,
      obstacleRects: [],
    })

    /**
     * Container for the UNDER layer. All geometry calculations are relative to this element.
     * Since it uses "absolute inset-0", its rect matches the positioned parent area.
     */
    const containerRef = useRef<HTMLDivElement>(null)

    /**
     * Unique base IDs for gradient/filter per layer to avoid ID collisions across multiple arrows.
     */
    const gradientIdBase = React.useId()
    const filterIdBase = React.useId()

    /**
     * Re-entrancy guard for batched coordinate updates.
     */
    const isUpdatingRef = useRef(false)

    /**
     * Memoized obstacle count (array length is used in effects and loops).
     */
    const obstacleCount = obstacleElements?.length ?? 0

    /**
     * Convert an element's absolute rect into a relative anchor position inside the container.
     * Applies a small padding so the arrow tip sits just outside the element edge.
     */
    const calculatePosition = useCallback((element: HTMLElement, position: string) => {
      const rect = element.getBoundingClientRect()
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return { x: 0, y: 0 }

      const relativeX = rect.left - containerRect.left
      const relativeY = rect.top - containerRect.top
      const padding = 5

      switch (position) {
        case "top":
        case "top-center":
          return { x: relativeX + rect.width / 2, y: relativeY - padding }
        case "bottom":
        case "bottom-center":
          return { x: relativeX + rect.width / 2, y: relativeY + rect.height + padding }
        case "left":
        case "left-center":
          return { x: relativeX - padding, y: relativeY + rect.height / 2 }
        case "right":
        case "right-center":
          return { x: relativeX + rect.width + padding, y: relativeY + rect.height / 2 }
        case "center":
          return { x: relativeX + rect.width / 2, y: relativeY + rect.height / 2 }
        case "top-left":
          return { x: relativeX, y: relativeY }
        case "top-right":
          return { x: relativeX + rect.width, y: relativeY }
        case "bottom-left":
          return { x: relativeX, y: relativeY + rect.height }
        case "bottom-right":
          return { x: relativeX + rect.width, y: relativeY + rect.height }
        case "middle-left":
        case "center-left":
          return { x: relativeX, y: relativeY + rect.height / 2 }
        case "middle-right":
        case "center-right":
          return { x: relativeX + rect.width, y: relativeY + rect.height / 2 }
        case "middle-top":
        case "center-top":
          return { x: relativeX + rect.width / 2, y: relativeY }
        case "middle-bottom":
        case "center-bottom":
          return { x: relativeX + rect.width / 2, y: relativeY + rect.height }
        default:
          return { x: relativeX + rect.width / 2, y: relativeY + rect.height / 2 }
      }
    }, [])

    /**
     * Compute and set coordinate state from refs (if provided) or from direct props.
     * Uses basic tolerance to prevent unnecessary state updates.
     */
    const updateCoordinates = useCallback(() => {
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true
      try {
        if (startElement?.current && endElement?.current && containerRef.current) {
          const sp = calculatePosition(startElement.current, startPosition)
          const ep = calculatePosition(endElement.current, endPosition)

          const obstacleRects: RectLite[] = []
          if (obstacleCount > 0) {
            for (let i = 0; i < obstacleCount; i++) {
              const ref = obstacleElements[i]
              if (ref?.current) {
                const o = ref.current.getBoundingClientRect()
                const c = containerRef.current.getBoundingClientRect()
                obstacleRects.push({
                  x: o.left - c.left,
                  y: o.top - c.top,
                  width: o.width,
                  height: o.height,
                })
              }
            }
          }

          setCoordinates((prev) => {
            const same =
              Math.abs(prev.startX - sp.x) < 0.5 &&
              Math.abs(prev.startY - sp.y) < 0.5 &&
              Math.abs(prev.endX - ep.x) < 0.5 &&
              Math.abs(prev.endY - ep.y) < 0.5 &&
              prev.obstacleRects.length === obstacleRects.length
            if (same) return prev
            return { startX: sp.x, startY: sp.y, endX: ep.x, endY: ep.y, obstacleRects }
          })
        } else {
          // Fallback to direct coordinates when refs are not provided.
          setCoordinates((prev) => {
            const same =
              Math.abs(prev.startX - startX) < 0.5 &&
              Math.abs(prev.startY - startY) < 0.5 &&
              Math.abs(prev.endX - endX) < 0.5 &&
              Math.abs(prev.endY - endY) < 0.5 &&
              prev.obstacleRects.length === 0
            if (same) return prev
            return { startX, startY, endX, endY, obstacleRects: [] }
          })
        }
      } finally {
        isUpdatingRef.current = false
      }
    }, [
      startElement,
      endElement,
      startPosition,
      endPosition,
      startX,
      startY,
      endX,
      endY,
      calculatePosition,
      obstacleElements,
      obstacleCount,
    ])

    /**
     * Recompute when docking positions or direct coordinates change.
     */
    useEffect(() => {
      updateCoordinates()
    }, [startPosition, endPosition, startX, startY, endX, endY, obstacleCount, updateCoordinates])

    /**
     * Observe start/end/obstacle elements for size/DOM changes and update coordinates.
     * Also reacts to window resize and scroll (in case layout shifts).
     */
    useEffect(() => {
      if (!startElement?.current || !endElement?.current) return
      const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updateCoordinates))
      const mutationObserver = new MutationObserver(() => requestAnimationFrame(updateCoordinates))

      const els: HTMLElement[] = [startElement.current, endElement.current]
      for (let i = 0; i < obstacleCount; i++) {
        const cur = obstacleElements[i]?.current
        if (cur) els.push(cur)
      }

      els.forEach((el) => {
        resizeObserver.observe(el)
        mutationObserver.observe(el, { attributes: true, childList: true, subtree: true })
      })

      const onResize = () => requestAnimationFrame(updateCoordinates)
      const onScroll = () => requestAnimationFrame(updateCoordinates)
      window.addEventListener("resize", onResize, { passive: true })
      window.addEventListener("scroll", onScroll, { passive: true })

      return () => {
        resizeObserver.disconnect()
        mutationObserver.disconnect()
        window.removeEventListener("resize", onResize)
        window.removeEventListener("scroll", onScroll)
      }
    }, [startElement?.current, endElement?.current, obstacleCount, updateCoordinates, obstacleElements])

    /**
     * Compute the main curve's path string and the second control anchor
     * used to derive tangents for the head orientations.
     */
    const createCurvePath = React.useMemo(() => {
      const { startX: sx, startY: sy, endX: ex, endY: ey, obstacleRects } = coordinates
      const dx = ex - sx
      const dy = ey - sy
      const distance = Math.hypot(dx, dy)

      // Directional bias. "auto" chooses a dominant axis based on deltas.
      let effectiveDirection = curveDirection
      if (curveDirection === "auto") {
        if (Math.abs(dx) > Math.abs(dy)) {
          effectiveDirection = dy > 0 ? "up" : "down"
        } else {
          effectiveDirection = dx > 0 ? "left" : "right"
        }
      }

      let offsetX = 0
      let offsetY = 0
      const baseOffset = Math.min(distance * curveIntensity, 150)

      switch (effectiveDirection) {
        case "up":
          offsetY = -baseOffset
          break
        case "down":
          offsetY = baseOffset
          break
        case "left":
          offsetX = -baseOffset
          break
        case "right":
          offsetX = baseOffset
          break
      }

      let pathString = ""
      // The second control point (for cubic) or the last waypoint used to infer end tangent.
      let control2X = ex
      let control2Y = ey

      switch (curveType) {
        case "smooth": {
          const c1x = sx + dx * 0.3 + offsetX * 0.5
          const c1y = sy + dy * 0.3 + offsetY * 0.5
          control2X = ex - dx * 0.3 + offsetX * 0.5
          control2Y = ey - dy * 0.3 + offsetY * 0.5
          pathString = `M ${sx} ${sy} C ${c1x} ${c1y} ${control2X} ${control2Y} ${ex} ${ey}`
          break
        }
        case "dramatic": {
          const c1x = sx + dx * 0.1 + offsetX * 1.5
          const c1y = sy + dy * 0.1 + offsetY * 1.5
          control2X = ex - dx * 0.1 + offsetX * 1.5
          control2Y = ey - dy * 0.1 + offsetY * 1.5
          pathString = `M ${sx} ${sy} C ${c1x} ${c1y} ${control2X} ${control2Y} ${ex} ${ey}`
          break
        }
        case "s-curve": {
          const c1x = sx + dx * 0.25 + offsetX * 0.8
          const c1y = sy + dy * 0.25 + offsetY * 0.8
          control2X = ex - dx * 0.25 - offsetX * 0.8
          control2Y = ey - dy * 0.25 - offsetY * 0.8
          pathString = `M ${sx} ${sy} C ${c1x} ${c1y} ${control2X} ${control2Y} ${ex} ${ey}`
          break
        }
        case "wave": {
          pathString = `M ${sx} ${sy}`
          const segments = 8
          for (let i = 1; i <= segments; i++) {
            const t = i / segments
            const x = sx + dx * t
            const y = sy + dy * t + Math.sin(t * Math.PI * 4) * baseOffset * 0.3
            const pt = (i - 1) / segments
            const px = sx + dx * pt
            const py = sy + dy * pt + Math.sin(pt * Math.PI * 4) * baseOffset * 0.3
            const cpx = (px + x) / 2
            const cpy = (py + y) / 2
            pathString += ` Q ${cpx} ${cpy} ${x} ${y}`
          }
          // Approximate end control for tangent calculation.
          control2X = sx + dx * 0.875
          control2Y = sy + dy * 0.875
          break
        }
        case "elegant": {
          const midX = (sx + ex) / 2 + offsetX * 0.8
          const midY = (sy + ey) / 2 + offsetY * 0.8
          const c1x = sx + dx * 0.2 + offsetX * 0.4
          const c1y = sy + dy * 0.2 + offsetY * 0.4
          control2X = ex - dx * 0.2 + offsetX * 0.4
          control2Y = ey - dy * 0.2 + offsetY * 0.4
          pathString = `M ${sx} ${sy} C ${c1x} ${c1y} ${midX} ${midY} ${midX} ${midY} S ${control2X} ${control2Y} ${ex} ${ey}`
          break
        }
        case "zigzag": {
          pathString = `M ${sx} ${sy}`
          const segments = 6
          for (let i = 1; i <= segments; i++) {
            const t = i / segments
            const x = sx + dx * t
            const zz = i % 2 === 0 ? baseOffset * 0.4 : -baseOffset * 0.4
            const y = sy + dy * t + zz
            pathString += ` L ${x} ${y}`
          }
          pathString += ` L ${ex} ${ey}`
          // Approximate control to derive tangent for head orientation.
          control2X = sx + dx * 0.833
          control2Y = sy + dy * 0.833
          break
        }
        case "around-obstacle":
        case "shortest-path": {
          const obs = obstacleRects
          if (obs.length) {
            pathString = `M ${sx} ${sy}`
            let cx = sx
            let cy = sy
            obs.forEach((o) => {
              // Simple detour heuristic: create a waypoint that clears the obstacle box with margin.
              const margin = 25
              const left = o.x - margin
              const right = o.x + o.width + margin
              const top = o.y - margin
              const bottom = o.y + o.height + margin
              const intersects = cx < right && ex > left && Math.min(cy, ey) < bottom && Math.max(cy, ey) > top
              if (intersects) {
                const goRight = ex > o.x + o.width / 2
                const goUp = ey < o.y + o.height / 2
                const wayX = goRight ? right + 20 : left - 20
                const wayY = goUp ? top - 10 : bottom + 10
                pathString += ` L ${wayX} ${wayY}`
                cx = wayX
                cy = wayY
              }
            })
            pathString += ` L ${ex} ${ey}`
            // Use last waypoint as a pseudo-control to align head orientation.
            control2X = cx
            control2Y = cy
          } else {
            // Fallback to a smooth cubic if no obstacles.
            const c1x = sx + dx * 0.3
            const c1y = sy + dy * 0.3
            control2X = ex - dx * 0.3
            control2Y = ey - dy * 0.3
            pathString = `M ${sx} ${sy} C ${c1x} ${c1y} ${control2X} ${control2Y} ${ex} ${ey}`
          }
          break
        }
        default: {
          // Default: similar to "smooth" with mild bias in the chosen direction.
          const c1x = sx + dx * 0.3 + offsetX * 0.5
          const c1y = sy + dy * 0.3 + offsetY * 0.5
          control2X = ex - dx * 0.3 + offsetX * 0.5
          control2Y = ey - dy * 0.3 + offsetY * 0.5
          pathString = `M ${sx} ${sy} C ${c1x} ${c1y} ${control2X} ${control2Y} ${ex} ${ey}`
        }
      }
      return { pathString, control2X, control2Y }
    }, [coordinates, curveType, curveDirection, curveIntensity])

    // Destructure computed path and anchors for orientation/tangents.
    const { pathString, control2X, control2Y } = createCurvePath
    const { startX: sx, startY: sy, endX: ex, endY: ey } = coordinates

    // Effective head sizes (use per-head override if provided).
    const effStartSize = startArrowSize || arrowSize
    const effEndSize = endArrowSize || arrowSize

    // Tangents for head orientations.
    const startTangent = Math.atan2(control2Y - sy, control2X - sx)
    const endTangent = Math.atan2(ey - control2Y, ex - control2X)

    // Final head angles at each end.
    const startAngle = startTangent + Math.PI
    const endAngle = endTangent

    // Construct head path strings (or empty if disabled).
    const startHeadPath =
      showStartArrow &&
      createArrowHead(sx, sy, startAngle, effStartSize, startArrowShape, startArrowRotation, startArrowFilled)
    const endHeadPath =
      showEndArrow && createArrowHead(ex, ey, endAngle, effEndSize, endArrowShape, endArrowRotation, endArrowFilled)

    // When both gradientFrom and gradientTo are present, use gradient stroke; otherwise solid color.
    const hasGradient = !!(gradientFrom && gradientTo)

    // Local overlay segments to visually place the line over heads when they share a layer.
    const overlayLen = Math.max(strokeWidth * 2 + 6, 12)
    const startOverlayPath = `M ${sx - Math.cos(startTangent) * overlayLen} ${sy - Math.sin(startTangent) * overlayLen} L ${sx} ${sy}`
    const endOverlayPath = `M ${ex - Math.cos(endTangent) * overlayLen} ${ey - Math.sin(endTangent) * overlayLen} L ${ex} ${ey}`

    // Shared class for both UNDER and OVER containers.
    const arrowClass = cn(curvedArrowVariants({ variant, size }), className)

    /**
     * Render the SVG for one layer.
     *
     * UNDER layer:
     *  - Renders main line (optionally with glow) and optional animated dash overlay.
     *  - Renders any heads configured to headLayer="under".
     *  - Can draw a tiny overlay segment if startLineOverHead/endLineOverHead is true.
     *
     * OVER layer:
     *  - Renders heads configured to headLayer="over" and optional local overlay segment.
     *  - Does NOT render the main line (to avoid stacking twice).
     */
    const renderSVG = (layer: "under" | "over") => {
      // Unique IDs per layer avoid collisions across multiple CurvedArrow instances.
      const gid = `${gradientIdBase}-${layer}`
      const fid = `${filterIdBase}-${layer}`

      const showStartOnLayer = !!startHeadPath && startHeadLayer === layer
      const showEndOnLayer = !!endHeadPath && endHeadLayer === layer
      const showLineOnLayer = layer === "under" // main path is only drawn on UNDER

      // Determine effective stroke/fill sources.
      const defaultStroke = hasGradient ? `url(#${gid})` : color
      const sStroke = startArrowStrokeColor ?? defaultStroke
      const eStroke = endArrowStrokeColor ?? defaultStroke
      const sFill = startArrowFillColor ?? defaultStroke
      const eFill = endArrowFillColor ?? defaultStroke

      return (
        <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
            <filter id={fid}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Optional glow for certain variants */}
          {showLineOnLayer &&
            (variant === "glow" ||
              variant === "neon" ||
              variant === "fire" ||
              variant === "electric" ||
              variant === "cosmic") && (
              <path
                d={pathString}
                stroke={defaultStroke}
                strokeWidth={strokeWidth + 4}
                fill="none"
                strokeLinecap="round"
                opacity="0.4"
                filter={`url(#${fid})`}
              />
            )}

          {/* Main line */}
          {showLineOnLayer && (
            <path d={pathString} stroke={defaultStroke} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
          )}

          {/* Animated white dash overlay on the main path */}
          {showLineOnLayer && animated && (
            <path
              d={pathString}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeDasharray="12,8"
              strokeLinecap="round"
              opacity="0.8"
              style={{ animationDelay, animationDirection }}
            >
              <animate
                attributeName="stroke-dashoffset"
                values={
                  animationDirection === "reverse" || animationDirection === "alternate-reverse" ? "20;0" : "0;20"
                }
                dur={animationDuration}
                repeatCount="indefinite"
              />
            </path>
          )}

          {/* Heads on this layer */}
          {showStartOnLayer && (
            <path
              d={startHeadPath!}
              stroke={sStroke}
              strokeWidth={startArrowStrokeWidth ?? strokeWidth}
              fill={startArrowFilled || (startArrowShape || "").includes("filled") ? sFill : "none"}
              strokeLinecap="round"
              opacity={startArrowOpacity ?? 1}
            />
          )}
          {showEndOnLayer && (
            <path
              d={endHeadPath!}
              stroke={eStroke}
              strokeWidth={endArrowStrokeWidth ?? strokeWidth}
              fill={endArrowFilled || (endArrowShape || "").includes("filled") ? eFill : "none"}
              strokeLinecap="round"
              opacity={endArrowOpacity ?? 1}
            />
          )}

          {/* Optional small overlays to place the line visually over the head */}
          {showStartOnLayer && startLineOverHead && (
            <path
              d={startOverlayPath}
              stroke={defaultStroke}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          )}
          {showEndOnLayer && endLineOverHead && (
            <path
              d={endOverlayPath}
              stroke={defaultStroke}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          )}
        </svg>
      )
    }

    /**
     * Render two sibling containers with explicit z-index to guarantee correct stacking
     * relative to your elements. Ensure the parent container is positioned (relative).
     */
    return (
      <>
        {/* UNDER container: z-2 (above your "under" elements in z-1) */}
        <div ref={containerRef} className={arrowClass} aria-label={ariaLabel} role="img" style={{ zIndex: 2 }}>
          {renderSVG("under")}
        </div>

        {/* OVER container: z-4 (below your "over" elements in z-5) */}
        <div className={arrowClass} aria-hidden="true" style={{ zIndex: 4 }}>
          {renderSVG("over")}
        </div>
      </>
    )
  },
)

CurvedArrow.displayName = "CurvedArrow"

export { CurvedArrow, curvedArrowVariants }
