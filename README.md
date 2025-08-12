# CurvedArrow Component

`CurvedArrow` is a highly flexible, DOM-aware React component that renders animated, curved SVG arrows between two elements or coordinates. It supports gradient strokes, multiple curve styles, customizable arrowhead shapes, obstacle avoidance, and two-layer rendering for precise z-index stacking. Built with performance and accessibility in mind, it is ideal for dynamic, interactive applications such as diagramming tools, flowcharts, or UI connectors.

## Features

- **Flexible Positioning**: Connects elements using refs (`startElement`, `endElement`) or absolute coordinates (`startX`, `startY`, `endX`, `endY`) with docking position options (e.g., `top`, `right-center`).
- **Customizable Curves**: Supports multiple curve styles (`smooth`, `dramatic`, `s-curve`, `wave`, `zigzag`, `around-obstacle`, `shortest-path`) with adjustable intensity and directional bias.
- **Arrowhead Styling**: Offers a variety of arrowhead shapes (`triangle`, `circle`, `star`, etc.), with options for filled/unfilled, rotation, size, stroke, and fill customization.
- **Obstacle Avoidance**: Automatically detours around obstacle elements when using `around-obstacle` or `shortest-path` curve types.
- **Two-Layer Rendering**: Uses `UNDER` (z-2) and `OVER` (z-4) layers to ensure correct stacking with other page elements, supporting `z-1` (under arrow) and `z-5` (over arrow) elements.
- **Animations**: Includes an optional animated white dash overlay with customizable duration, delay, and direction.
- **Performance Optimization**: Leverages `ResizeObserver` and `MutationObserver` for efficient geometry updates, with batched rendering via `requestAnimationFrame` and change tolerance checks.
- **Accessibility**: Provides `aria-label` on the `UNDER` layer (with `role="img"`) and marks the `OVER` layer as `aria-hidden` for clarity.
- **Tailwind Integration**: Uses `class-variance-authority` for styling variants (e.g., `glow`, `neon`, `fire`) and size options (e.g., `xs`, `sm`, `lg`).

## Usage

### Basic Example

Connect two DOM elements with a curved arrow:

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

Render an arrow using absolute coordinates:

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

### Obstacle Avoidance

Avoid obstacles by passing element refs:

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

## Props

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

## Styling Variants

The component uses `class-variance-authority` for Tailwind-based styling. Available variants include:

- **Visual Variants**: `default`, `glow`, `subtle`, `bold`, `neon`, `fire`, `ice`, `electric`, `shadow`, `rainbow`, `cosmic`, `emerald`, `rose`, `amber`, `violet`, `cyan`, `lime`, `pink`, `indigo`, `teal`, `orange`, `slate`.
- **Size Variants**: `xs`, `sm`, `default`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`, `8xl`, `9xl`.

Example:

```jsx
<CurvedArrow startElement={aRef} endElement={bRef} variant="neon" size="lg" />
```

## Z-Index Contract

To ensure correct stacking:

- Place elements **below** the arrow at `z-1`.
- Place elements **above** the arrow at `z-5`.
- The arrow renders in two layers:
  - `UNDER` layer at `z-2` (main path and any `under` heads).
  - `OVER` layer at `z-4` (any `over` heads and overlays).

Wrap the component in a relatively positioned container:

```jsx
<div className="relative">
  <div className="z-1">Under Arrow</div>
  <div className="z-5">Over Arrow</div>
  <CurvedArrow startElement={aRef} endElement={bRef} />
</div>
```

## Accessibility

- The `UNDER` layer has `role="img"` and an `aria-label` (customizable via `ariaLabel` prop).
- The `OVER` layer is marked `aria-hidden="true"` as it only contains supplementary visuals.

## Performance Notes

- Uses `ResizeObserver` and `MutationObserver` to track changes in element geometry.
- Batches updates with `requestAnimationFrame` and applies a tolerance check to minimize re-renders.
- Avoids unnecessary state updates when geometry changes are insignificant (<0.5px).

## Limitations

- Some curve types (`spiral`, `loop`, `heart`, `infinity`) are reserved for future implementation.
- Obstacle avoidance uses a simple heuristic; complex pathfinding may require custom logic.
- Ensure the parent container is relatively positioned to align the arrow correctly.

## Dependencies

- React
- `class-variance-authority` for styling variants
- Tailwind CSS (recommended for styling)

## Contributing

Contributions are welcome! Please submit issues or pull requests to the repository. Ensure any changes maintain compatibility with the z-index contract and accessibility features.

## License

MIT License
