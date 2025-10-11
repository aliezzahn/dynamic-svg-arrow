# 🎯 CurvedArrow Component

`CurvedArrow` is a **DOM-aware**, **highly flexible React component** for rendering animated, curved SVG arrows between two elements or coordinates.
It supports gradient strokes, multiple curve styles, custom arrowheads, obstacle avoidance, and precise two-layer rendering — built for **performance**, **accessibility**, and **dynamic UI experiences** such as animated, curved SVG arrows between elements or coordinates.
Perfect for **diagrams, flowcharts, tutorials, and interactive UIs**.

[![Shadcn Compatible](https://img.shields.io/badge/Shadcn-Compatible-brightgreen)](https://ui.shadcn.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-✓-38B2AC)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

### 🧩 Shadcn-Compatible

`CurvedArrow` is fully **compatible with [shadcn/ui](https://ui.shadcn.com)** and the **Shadcn Registry** ecosystem:

- ✅ Tailwind + CVA-based styling (`variant` & `size`)
- ✅ Accessible & ARIA-compliant
- ✅ TypeScript-ready
- ✅ Drop-in for `awesome-shadcn` projects
- ✅ Easily installable via NPM, Bun, or PNPM

**Badges:**
[![Shadcn Compatible](https://img.shields.io/badge/Shadcn-Compatible-brightgreen)](https://ui.shadcn.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-✓-38B2AC)](https://tailwindcss.com)

---

### 📥 Installation

```bash
# npm
npx shadcn@canary add https://dsa.hncore.website/r/curved-arrow.json

# bun
bunx --bun shadcn@canary add https://dsa.hncore.website/r/curved-arrow.json

# pnpm
pnpx shadcn@canary add https://dsa.hncore.website/r/curved-arrow.json
```

Import the component:

```tsx
import { CurvedArrow } from "@/components/curved-arrow";

function Demo() {
  return <CurvedArrow startX={0} startY={0} endX={200} endY={200} />;
}
```

---

### 🧱 Framework

Built with **[Modern.js](https://modernjs.dev)** — a next-generation React framework for speed and scalability.
It powers this project’s landing and docs with:

- ⚡️ Ultra-fast builds (Rsbuild / Rspack)
- 🧩 Hybrid SSR & SSG rendering
- 📖 Native MDX docs integration
- 🎨 Seamless Tailwind + TypeScript support
- 🚀 Optimized static & server deployments

---

## ✨ Features

- 🎯 **Flexible Positioning** – Connect via element refs or coordinates
- 🌈 **Customizable Curves** – `smooth`, `s-curve`, `wave`, `zigzag`, `around-obstacle`, and more
- 🧭 **Obstacle Avoidance** – Smart rerouting around elements
- 🖋️ **Stylable Arrowheads** – Multiple shapes, colors, and fill options
- 🧩 **Two-Layer Rendering** – Correct z-index stacking (`UNDER` / `OVER`)
- 💫 **Animations** – Optional motion dash overlay with duration & direction
- ⚙️ **Performance Optimized** – Uses observers + batched `requestAnimationFrame` updates
- ♿ **Accessible** – ARIA labels, roles, and semantic layers
- 🎨 **Tailwind Integration** – Style variants via `class-variance-authority`

---

## 🚀 Usage

### Basic Example

```jsx
import { CurvedArrow } from "./CurvedArrow";
import { useRef } from "react";

function Example() {
  const aRef = useRef(null);
  const bRef = useRef(null);

  return (
    <div className="relative h-64 w-full">
      <div ref={aRef} className="absolute z-1 w-16 h-16 bg-blue-200">
        A
      </div>
      <div ref={bRef} className="absolute z-5 w-16 h-16 bg-red-200 right-0">
        B
      </div>
      <CurvedArrow startElement={aRef} endElement={bRef} />
    </div>
  );
}
```

### Coordinate-Based Example

```jsx
<CurvedArrow
  startX={50}
  startY={50}
  endX={200}
  endY={200}
  curveType="s-curve"
  color="#FF5733"
  showStartArrow
  startArrowShape="circle"
/>
```

### 🧱 Obstacle Example

```jsx
const obstacleRef = useRef(null);
<CurvedArrow
  startElement={aRef}
  endElement={bRef}
  obstacleElements={[obstacleRef]}
  curveType="around-obstacle"
/>
<div ref={obstacleRef} className="absolute z-1 w-32 h-32 bg-gray-300">Obstacle</div>
```

---

## ⚙️ Props Overview

| Prop                    | Type                                                           | Default                    | Description                                                                 |
| ----------------------- | -------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| `startElement`          | `React.RefObject<HTMLElement>`                                 | -                          | Reference to the start element. Overrides `startX`/`startY`.                |
| `endElement`            | `React.RefObject<HTMLElement>`                                 | -                          | Reference to the end element. Overrides `endX`/`endY`.                      |
| `obstacleElements`      | `React.RefObject<HTMLElement>[]`                               | `[]`                       | Array of refs to elements to avoid in `around-obstacle` or `shortest-path`. |
| `startX`, `startY`      | `number`                                                       | `0`                        | Absolute start coordinates (used if `startElement` is not provided).        |
| `endX`, `endY`          | `number`                                                       | `100`                      | Absolute end coordinates (used if `endElement` is not provided).            |
| `startPosition`         | `string`                                                       | `"center"`                 | Docking position for `startElement` (e.g., `top`, `right-center`).          |
| `endPosition`           | `string`                                                       | `"center"`                 | Docking position for `endElement`.                                          |
| `curveIntensity`        | `number`                                                       | `0.4`                      | Curve strength (0 to 1+). Higher values create more pronounced curves.      |
| `curveType`             | `string`                                                       | `"smooth"`                 | Curve style: `smooth`, `dramatic`, `s-curve`, `wave`, `zigzag`, etc.        |
| `curveDirection`        | `"up" \| "down" \| "left" \| "right" \| "auto"`                | `"auto"`                   | Directional bias for curves.                                                |
| `strokeWidth`           | `number`                                                       | `4`                        | Base stroke width for the main path.                                        |
| `color`                 | `string`                                                       | `"#852DEE"`                | Solid stroke color (used if no gradient is defined).                        |
| `gradientFrom`          | `string`                                                       | `"#ffffff"`                | Gradient start color.                                                       |
| `gradientTo`            | `string`                                                       | `"#852DEE"`                | Gradient end color.                                                         |
| `showStartArrow`        | `boolean`                                                      | `false`                    | Show arrowhead at the start.                                                |
| `showEndArrow`          | `boolean`                                                      | `true`                     | Show arrowhead at the end.                                                  |
| `startArrowShape`       | `string`                                                       | `"triangle"`               | Shape of the start arrowhead (e.g., `circle`, `star`, `chevron`).           |
| `endArrowShape`         | `string`                                                       | `"triangle"`               | Shape of the end arrowhead.                                                 |
| `startArrowRotation`    | `number`                                                       | `0`                        | Rotation for start arrowhead (degrees).                                     |
| `endArrowRotation`      | `number`                                                       | `0`                        | Rotation for end arrowhead (degrees).                                       |
| `startArrowSize`        | `number`                                                       | -                          | Size override for start arrowhead (falls back to `arrowSize`).              |
| `endArrowSize`          | `number`                                                       | -                          | Size override for end arrowhead (falls back to `arrowSize`).                |
| `arrowSize`             | `number`                                                       | `20`                       | Base size for arrowheads.                                                   |
| `startArrowFilled`      | `boolean`                                                      | `false`                    | Fill start arrowhead with stroke/gradient color.                            |
| `endArrowFilled`        | `boolean`                                                      | `false`                    | Fill end arrowhead with stroke/gradient color.                              |
| `startArrowStrokeColor` | `string`                                                       | -                          | Stroke color override for start arrowhead.                                  |
| `endArrowStrokeColor`   | `string`                                                       | -                          | Stroke color override for end arrowhead.                                    |
| `startArrowFillColor`   | `string`                                                       | -                          | Fill color override for start arrowhead.                                    |
| `endArrowFillColor`     | `string`                                                       | -                          | Fill color override for end arrowhead.                                      |
| `startArrowStrokeWidth` | `number`                                                       | -                          | Stroke width override for start arrowhead.                                  |
| `endArrowStrokeWidth`   | `number`                                                       | -                          | Stroke width override for end arrowhead.                                    |
| `startArrowOpacity`     | `number`                                                       | `1`                        | Opacity for start arrowhead (0 to 1).                                       |
| `endArrowOpacity`       | `number`                                                       | `1`                        | Opacity for end arrowhead (0 to 1).                                         |
| `startHeadLayer`        | `"under" \| "over"`                                            | `"over"`                   | Layer for start arrowhead (`UNDER` or `OVER`).                              |
| `endHeadLayer`          | `"under" \| "over"`                                            | `"over"`                   | Layer for end arrowhead (`UNDER` or `OVER`).                                |
| `startLineOverHead`     | `boolean`                                                      | `false`                    | Draw a line overlay to visually place the line over the start arrowhead.    |
| `endLineOverHead`       | `boolean`                                                      | `false`                    | Draw a line overlay to visually place the line over the end arrowhead.      |
| `animated`              | `boolean`                                                      | `true`                     | Enable animated dash overlay on the main path.                              |
| `animationDuration`     | `string`                                                       | `"2s"`                     | Duration of one animation cycle (CSS time, e.g., `"2s"`).                   |
| `animationDelay`        | `string`                                                       | `"0s"`                     | Delay before animation starts (CSS time, e.g., `"0.3s"`).                   |
| `animationDirection`    | `"forward" \| "reverse" \| "alternate" \| "alternate-reverse"` | `"forward"`                | Animation direction mode.                                                   |
| `ariaLabel`             | `string`                                                       | `"Curved arrow connector"` | Accessible label for the `UNDER` layer.                                     |
| `variant`               | `string`                                                       | `"default"`                | Tailwind style variant (e.g., `glow`, `neon`, `fire`).                      |
| `size`                  | `string`                                                       | `"default"`                | Stroke size variant (e.g., `xs`, `sm`, `lg`).                               |
| `className`             | `string`                                                       | -                          | Additional class names for the container.                                   |

---

## 🎨 Styling Variants

Visual: `default`, `glow`, `neon`, `fire`, `electric`, `shadow`, `rainbow`, `emerald`, `rose`, `amber`, `violet`, `cyan`, `lime`, `pink`, `indigo`, `teal`, `orange`, `slate`
Size: `xs`, `sm`, `default`, `lg`, `xl`, `2xl`, `3xl`, … `9xl`

```jsx
<CurvedArrow startElement={aRef} endElement={bRef} variant="neon" size="lg" />
```

---

## 🪄 Z-Index Contract

| Layer          | z-index | Description             |
| -------------- | ------- | ----------------------- |
| UNDER          | `z-2`   | Main path & under-heads |
| OVER           | `z-4`   | Over-heads & overlays   |
| Elements below | `z-1`   | Under arrow             |
| Elements above | `z-5`   | Over arrow              |

```jsx
<div className="relative">
  <div className="z-1">Under Arrow</div>
  <CurvedArrow startElement={aRef} endElement={bRef} />
  <div className="z-5">Over Arrow</div>
</div>
```

---

## ♿ Accessibility

- `UNDER` layer → `role="img"` + `aria-label`
- `OVER` layer → `aria-hidden="true"`

---

## ⚡ Performance

- Tracks geometry via `ResizeObserver` + `MutationObserver`
- Batches updates with `requestAnimationFrame`
- Ignores sub-pixel geometry changes (<0.5px)

---

## 🧩 Limitations

- Future curve types: `spiral`, `loop`, `heart`, `infinity`
- Obstacle avoidance uses heuristic routing
- Parent container must be **relatively positioned**

---

## 📦 Dependencies

- React
- `class-variance-authority`
- Tailwind CSS (recommended)

---

## 🤝 Contributing

Contributions are welcome!
Submit issues or PRs that maintain performance, accessibility, and z-index consistency.

---

### 📜 License

Released under the [MIT License](./LICENSE) © 2025 [aliezzahn](https://github.com/aliezzahn)
