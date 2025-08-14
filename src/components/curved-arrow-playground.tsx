

import React, { useState, useRef, useCallback, useEffect } from "react";

import { CurvedArrow } from "@/components/ui/curved-arrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Copy,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Settings,
  Target,
  Zap,
  Home,
  Layers,
  LayoutTemplate,
  PanelRightClose,
} from "lucide-react";
import { toast } from "sonner";
import { CodeBlock } from "@/components/code-block";
import { Link } from "@modern-js/runtime/router";

type PanelKey = "curve" | "style" | "arrows" | "elements" | "canvas";

interface DraggableElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: string;
  opacity: number;
  shadow: string;
  rotation: number;
}

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = Number.parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const positionOptions = [
  "top",
  "bottom",
  "left",
  "right",
  "center",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "top-center",
  "bottom-center",
  "left-center",
  "right-center",
  "middle-left",
  "middle-right",
  "middle-top",
  "middle-bottom",
];

const variants = [
  "default",
  "glow",
  "subtle",
  "bold",
  "neon",
  "fire",
  "ice",
  "electric",
  "shadow",
  "rainbow",
  "cosmic",
];
const sizes = ["xs", "sm", "default", "lg", "xl", "2xl", "3xl"];
const arrowShapes = [
  "triangle",
  "circle",
  "square",
  "diamond",
  "star",
  "heart",
  "cross",
  "plus",
  "chevron",
  "double-chevron",
  "arrow",
  "hollow-triangle",
  "hollow-circle",
  "hollow-square",
  "hollow-diamond",
  "filled-circle",
  "filled-square",
  "filled-diamond",
  "filled-triangle",
  "line",
  "dot",
  "dash",
];

export function CurvedArrowPlayground() {
  const splitRef = useRef<HTMLDivElement>(null);
  const canvasOuterRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);

  // Responsive viewport controls
  const [viewportMode, setViewportMode] = useState<"fit" | "preset">("fit");
  const [playgroundWidth, setPlaygroundWidth] = useState(1024);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("desktop");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const obstacle1Ref = useRef<HTMLDivElement>(null);
  const obstacle2Ref = useRef<HTMLDivElement>(null);
  const obstacle3Ref = useRef<HTMLDivElement>(null);
  const obstacleRefs = React.useMemo(
    () => [obstacle1Ref, obstacle2Ref, obstacle3Ref],
    []
  );

  const [startPosition, setStartPosition] = useState("center");
  const [endPosition, setEndPosition] = useState("center");

  const [elements, setElements] = useState<DraggableElement[]>([
    {
      id: "start",
      x: 80,
      y: 120,
      width: 120,
      height: 72,
      label: "Start",
      borderRadius: 12,
      borderWidth: 0,
      borderColor: "#000000",
      backgroundColor: "#3b82f6",
      textColor: "#ffffff",
      fontSize: 14,
      fontWeight: "600",
      opacity: 1,
      shadow: "lg",
      rotation: 0,
    },
    {
      id: "end",
      x: 520,
      y: 280,
      width: 120,
      height: 72,
      label: "End",
      borderRadius: 12,
      borderWidth: 0,
      borderColor: "#000000",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      fontSize: 14,
      fontWeight: "600",
      opacity: 1,
      shadow: "lg",
      rotation: 0,
    },
  ]);

  const [obstacles, setObstacles] = useState<DraggableElement[]>([
    {
      id: "obstacle1",
      x: 300,
      y: 170,
      width: 100,
      height: 60,
      label: "Block 1",
      borderRadius: 10,
      borderWidth: 0,
      borderColor: "#000000",
      backgroundColor: "#ef4444",
      textColor: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
      opacity: 1,
      shadow: "lg",
      rotation: 0,
    },
    {
      id: "obstacle2",
      x: 390,
      y: 240,
      width: 96,
      height: 54,
      label: "Block 2",
      borderRadius: 10,
      borderWidth: 0,
      borderColor: "#000000",
      backgroundColor: "#f97316",
      textColor: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
      opacity: 1,
      shadow: "lg",
      rotation: 0,
    },
  ]);

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    elementId: string | null;
    elementType: "element" | "obstacle" | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    elementId: null,
    elementType: null,
    offset: { x: 0, y: 0 },
  });

  const [config, setConfig] = useState({
    curveType: "smooth" as const,
    curveDirection: "auto" as const,
    curveIntensity: 0.5,
    strokeWidth: 4,
    variant: "default" as const,
    size: "default" as const,
    animated: true,
    animationDuration: "2s",
    animationDirection: "forward" as const,
    animationDelay: "0s",
    useGradient: true,
    gradientFrom: "#ffffff",
    gradientTo: "#852DEE",
    solidColor: "#852DEE",
    showObstacles: true,
    showStartArrow: false,
    startArrowShape: "triangle" as const,
    startArrowRotation: 0,
    startArrowSize: 22,
    startArrowStrokeWidth: 4,
    startArrowOpacity: 1,
    startArrowStrokeColor: "#852DEE",
    startArrowFillColor: "#852DEE",
    startArrowFilled: false,
    startHeadLayer: "over" as "over" | "under",
    startLineOverHead: "under" as "under" | "over",
    showEndArrow: true,
    endArrowShape: "triangle" as const,
    endArrowRotation: 0,
    endArrowSize: 22,
    endArrowStrokeWidth: 4,
    endArrowOpacity: 1,
    endArrowStrokeColor: "#852DEE",
    endArrowFillColor: "#852DEE",
    endArrowFilled: false,
    endHeadLayer: "over" as "over" | "under",
    endLineOverHead: "under" as "under" | "over",
    startElementLayer: "over" as "under" | "over",
    endElementLayer: "over" as "under" | "over",
    playgroundBackground: "transparent",
    playgroundBackgroundColor: "#f8fafc",
    playgroundGradientFrom: "#f1f5f9",
    playgroundGradientTo: "#e2e8f0",
    playgroundGrid: true,
    playgroundGridSize: 10,
    playgroundGridColor: "#94a3b8",
    playgroundGridOpacity: 0.35,
  });

  const isStartDisabled = !config.showStartArrow;
  const isEndDisabled = !config.showEndArrow;
  const isObstaclesDisabled = !config.showObstacles;

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const currentSelectedElement = selectedElement
    ? [...elements, ...obstacles].find((el) => el.id === selectedElement)
    : null;

  // Split resizing (desktop only)
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const min = 260;
      const max = Math.max(min, rect.width - 360);
      const next = Math.min(Math.max(e.clientX - rect.left, min), max);
      setLeftWidth(next);
    };
    const onMouseUp = () => {
      if (!isResizing) return;
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    if (isResizing) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  // Fit mode via ResizeObserver
  useEffect(() => {
    if (viewportMode !== "fit") return;
    if (!canvasOuterRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        setPlaygroundWidth(w);
      }
    });
    ro.observe(canvasOuterRef.current);
    return () => ro.disconnect();
  }, [viewportMode]);

  const breakpoints = [
    { name: "Fit", value: "fit", width: 0, icon: LayoutTemplate },
    { name: "Mobile", value: "mobile", width: 375, icon: Smartphone },
    { name: "Tablet", value: "tablet", width: 768, icon: Tablet },
    { name: "Desktop", value: "desktop", width: 1024, icon: Monitor },
    { name: "Large", value: "large", width: 1440, icon: Monitor },
  ];

  const setBreakpoint = (bp: string) => {
    const found = breakpoints.find((b) => b.value === bp);
    if (!found) return;
    if (bp === "fit") {
      setViewportMode("fit");
    } else {
      setViewportMode("preset");
      setPlaygroundWidth(found.width);
    }
    setCurrentBreakpoint(bp);
  };

  const addObstacle = () => {
    const n = obstacles.length + 1;
    const o: DraggableElement = {
      id: `obstacle${n}`,
      x: Math.random() * 260 + 140,
      y: Math.random() * 220 + 80,
      width: 70 + Math.random() * 60,
      height: 42 + Math.random() * 40,
      label: `Block ${n}`,
      borderRadius: 10,
      borderWidth: 0,
      borderColor: "#000000",
      backgroundColor: "#8b5cf6",
      textColor: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
      opacity: 1,
      shadow: "lg",
      rotation: 0,
    };
    setObstacles((prev) => [...prev, o]);
  };

  const removeObstacle = (id: string) => {
    setObstacles((prev) => prev.filter((o) => o.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const onCanvasMouseDown = useCallback(
    (
      e: React.MouseEvent,
      elementId: string,
      elementType: "element" | "obstacle"
    ) => {
      e.preventDefault();
      const target = document.getElementById(elementId);
      if (!target) return;
      const tRect = target.getBoundingClientRect();
      setDragState({
        isDragging: true,
        elementId,
        elementType,
        offset: { x: e.clientX - tRect.left, y: e.clientY - tRect.top },
      });
      setSelectedElement(elementId);
    },
    []
  );

  const onCanvasMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragState.isDragging || !dragState.elementId) return;
      const containerRect = (
        e.currentTarget as HTMLDivElement
      ).getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragState.offset.x;
      const newY = e.clientY - containerRect.top - dragState.offset.y;
      const constrainedX = Math.max(
        0,
        Math.min(
          newX,
          (viewportMode === "fit" ? containerRect.width : playgroundWidth) - 60
        )
      );
      const constrainedY = Math.max(
        0,
        Math.min(newY, containerRect.height - 40)
      );
      if (dragState.elementType === "element") {
        setElements((prev) =>
          prev.map((el) =>
            el.id === dragState.elementId
              ? { ...el, x: constrainedX, y: constrainedY }
              : el
          )
        );
      } else {
        setObstacles((prev) =>
          prev.map((el) =>
            el.id === dragState.elementId
              ? { ...el, x: constrainedX, y: constrainedY }
              : el
          )
        );
      }
    },
    [dragState, playgroundWidth, viewportMode]
  );

  const onCanvasUp = useCallback(() => {
    setDragState({
      isDragging: false,
      elementId: null,
      elementType: null,
      offset: { x: 0, y: 0 },
    });
  }, []);

  const updateElement = (id: string, updates: Partial<DraggableElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };
  const updateObstacle = (id: string, updates: Partial<DraggableElement>) => {
    setObstacles((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const resetConfig = () => {
    setConfig((prev) => ({
      ...prev,
      curveType: "smooth",
      curveDirection: "auto",
      curveIntensity: 0.5,
      strokeWidth: 4,
      variant: "default",
      size: "default",
      animated: true,
      animationDuration: "2s",
      animationDirection: "forward",
      animationDelay: "0s",
      useGradient: true,
      gradientFrom: "#ffffff",
      gradientTo: "#852DEE",
      solidColor: "#852DEE",
      showObstacles: true,
      showStartArrow: false,
      startArrowShape: "triangle",
      startArrowRotation: 0,
      startArrowSize: 22,
      startArrowStrokeWidth: 4,
      startArrowOpacity: 1,
      startArrowStrokeColor: "#852DEE",
      startArrowFillColor: "#852DEE",
      startArrowFilled: false,
      startHeadLayer: "over",
      startLineOverHead: "under",
      showEndArrow: true,
      endArrowShape: "triangle",
      endArrowRotation: 0,
      endArrowSize: 22,
      endArrowStrokeWidth: 4,
      endArrowOpacity: 1,
      endArrowStrokeColor: "#852DEE",
      endArrowFillColor: "#852DEE",
      endArrowFilled: false,
      endHeadLayer: "over",
      endLineOverHead: "under",
      startElementLayer: "over",
      endElementLayer: "over",
      playgroundBackground: "transparent",
      playgroundBackgroundColor: "#f8fafc",
      playgroundGradientFrom: "#f1f5f9",
      playgroundGradientTo: "#e2e8f0",
      playgroundGrid: true,
      playgroundGridSize: 10,
      playgroundGridColor: "#94a3b8",
      playgroundGridOpacity: 0.35,
    }));
    toast.success("Configuration reset!");
  };

  const generateCode = () => {
    const props: string[] = [];
    props.push(`startElement={startRef}`);
    props.push(`endElement={endRef}`);
    if (config.showObstacles && obstacles.length > 0) {
      const names = obstacles
        .slice(0, 3)
        .map((_, i) => `obstacle${i + 1}Ref`)
        .join(", ");
      props.push(`obstacleElements={[${names}]}`);
    }
    if (config.curveType !== "smooth")
      props.push(`curveType="${config.curveType}"`);
    if (config.curveDirection !== "auto")
      props.push(`curveDirection="${config.curveDirection}"`);
    if (config.curveIntensity !== 0.5)
      props.push(`curveIntensity={${config.curveIntensity}}`);
    if (config.strokeWidth !== 4)
      props.push(`strokeWidth={${config.strokeWidth}}`);
    if (config.variant !== "default") props.push(`variant="${config.variant}"`);
    if (config.size !== "default") props.push(`size="${config.size}"`);
    if (!config.animated) props.push(`animated={false}`);
    if (config.animationDuration !== "2s")
      props.push(`animationDuration="${config.animationDuration}"`);
    if (config.animationDirection !== "forward")
      props.push(`animationDirection="${config.animationDirection}"`);
    if (config.animationDelay !== "0s")
      props.push(`animationDelay="${config.animationDelay}"`);
    if (config.useGradient) {
      if (config.gradientFrom !== "#ffffff")
        props.push(`gradientFrom="${config.gradientFrom}"`);
      if (config.gradientTo !== "#852DEE")
        props.push(`gradientTo="${config.gradientTo}"`);
    } else {
      props.push(`gradientFrom="${config.solidColor}"`);
      props.push(`gradientTo="${config.solidColor}"`);
    }

    if (config.showStartArrow) props.push(`showStartArrow`);
    if (!config.showEndArrow) props.push(`showEndArrow={false}`);
    if (startPosition !== "center")
      props.push(`startPosition="${startPosition}"`);
    if (endPosition !== "center") props.push(`endPosition="${endPosition}"`);

    if (config.startHeadLayer !== "over")
      props.push(`startHeadLayer="${config.startHeadLayer}"`);
    if (config.endHeadLayer !== "over")
      props.push(`endHeadLayer="${config.endHeadLayer}"`);
    if (config.startLineOverHead === "over") props.push(`startLineOverHead`);
    if (config.endLineOverHead === "over") props.push(`endLineOverHead`);

    props.push(`startArrowStrokeColor="${config.startArrowStrokeColor}"`);
    props.push(`startArrowFillColor="${config.startArrowFillColor}"`);
    if (config.startArrowStrokeWidth !== 4)
      props.push(`startArrowStrokeWidth={${config.startArrowStrokeWidth}}`);
    if (config.startArrowOpacity !== 1)
      props.push(`startArrowOpacity={${config.startArrowOpacity}}`);
    if (config.startArrowFilled) props.push(`startArrowFilled`);

    props.push(`endArrowStrokeColor="${config.endArrowStrokeColor}"`);
    props.push(`endArrowFillColor="${config.endArrowFillColor}"`);
    if (config.endArrowStrokeWidth !== 4)
      props.push(`endArrowStrokeWidth={${config.endArrowStrokeWidth}}`);
    if (config.endArrowOpacity !== 1)
      props.push(`endArrowOpacity={${config.endArrowOpacity}}`);
    if (config.endArrowFilled) props.push(`endArrowFilled`);

    return `<CurvedArrow
  ${props.join("\n  ")}
/>`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    toast.success("Code copied to clipboard");
  };

  const layerToZ = (layer: "under" | "over") => (layer === "under" ? 1 : 5);

  const getElementStyle = (element: DraggableElement) => {
    const which =
      element.id === "start"
        ? config.startElementLayer
        : element.id === "end"
        ? config.endElementLayer
        : "over";
    const zIndex = layerToZ(which as "under" | "over");
    return {
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      backgroundColor: element.backgroundColor,
      color: element.textColor,
      fontSize: element.fontSize,
      fontWeight: element.fontWeight as any,
      borderRadius: element.borderRadius,
      borderWidth: element.borderWidth,
      borderColor: element.borderColor,
      borderStyle: element.borderWidth > 0 ? "solid" : "none",
      opacity: element.opacity,
      transform: `rotate(${element.rotation}deg)`,
      boxShadow: "var(--tw-shadow-lg)",
      position: "absolute" as const,
      zIndex,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "grab",
      userSelect: "none" as const,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar (mobile-first) */}
      <div className="sticky top-14 md:top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 h-12 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Playground</span>
        </div>
        <Sheet open={mobilePanelOpen} onOpenChange={setMobilePanelOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <PanelRightClose className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[90vw] sm:w-[420px] overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>Playground Settings</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <PanelContent
                config={config}
                setConfig={setConfig}
                startPosition={startPosition}
                setStartPosition={setStartPosition}
                endPosition={endPosition}
                setEndPosition={setEndPosition}
                isStartDisabled={!config.showStartArrow}
                isEndDisabled={!config.showEndArrow}
                isObstaclesDisabled={!config.showObstacles}
                obstacles={obstacles}
                addObstacle={addObstacle}
                removeObstacle={removeObstacle}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                elements={elements}
                updateElement={updateElement}
                updateObstacle={updateObstacle}
                playgroundWidth={playgroundWidth}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div ref={splitRef} className="flex w-full pb-24 sm:pb-0">
        {/* Left panel (hidden on mobile, visible md+) */}
        <aside
          className="relative border-r bg-card/50 flex-col hidden md:flex"
          style={{ width: leftWidth }}
        >
          <div className="p-4 border-b">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-2 overflow-hidden">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground shrink-0"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden 2xl:inline">Home</span>
                </Link>
                <span className="text-muted-foreground shrink-0">/</span>
                <h2 className="text-lg font-semibold truncate">Playground</h2>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="whitespace-nowrap bg-transparent"
                >
                  <Copy className="w-4 h-4 mr-0 xl:mr-2" />
                  <span className="hidden xl:inline">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetConfig}
                  className="whitespace-nowrap bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-0 xl:mr-2" />
                  <span className="hidden xl:inline">Reset</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex">
            <nav className="w-36 border-r p-2 space-y-1 bg-background/60">
              {[
                { key: "curve", label: "Curve", icon: Zap },
                { key: "style", label: "Style", icon: Palette },
                { key: "arrows", label: "Arrows", icon: Target },
                { key: "elements", label: "Elements", icon: Settings },
                { key: "canvas", label: "Canvas", icon: Monitor },
              ].map((item) => {
                const Icon = item.icon;
                const active = (item.key as PanelKey) === ("curve" as PanelKey);
                return (
                  <PanelButton
                    key={item.key}
                    icon={Icon}
                    label={item.label}
                    panelKey={item.key as PanelKey}
                  />
                );
              })}
            </nav>

            <PanelContent
              config={config}
              setConfig={setConfig}
              startPosition={startPosition}
              setStartPosition={setStartPosition}
              endPosition={endPosition}
              setEndPosition={setEndPosition}
              isStartDisabled={isStartDisabled}
              isEndDisabled={isEndDisabled}
              isObstaclesDisabled={isObstaclesDisabled}
              obstacles={obstacles}
              addObstacle={addObstacle}
              removeObstacle={removeObstacle}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              elements={elements}
              updateElement={updateElement}
              updateObstacle={updateObstacle}
              playgroundWidth={playgroundWidth}
            />
          </div>
        </aside>

        {/* Splitter (desktop only) */}
        <div
          className="w-1 bg-border hover:bg-primary/30 cursor-col-resize hidden md:block"
          onMouseDown={() => setIsResizing(true)}
          aria-label="Resize panel"
        />

        {/* Right: Canvas */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="h-12 border-b flex items-center justify-between px-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { name: "Fit", value: "fit", width: 0, icon: LayoutTemplate },
                {
                  name: "Mobile",
                  value: "mobile",
                  width: 375,
                  icon: Smartphone,
                },
                { name: "Tablet", value: "tablet", width: 768, icon: Tablet },
                {
                  name: "Desktop",
                  value: "desktop",
                  width: 1024,
                  icon: Monitor,
                },
                { name: "Large", value: "large", width: 1440, icon: Monitor },
              ].map((bp) => {
                const Icon = bp.icon;
                const active = currentBreakpoint === bp.value;
                return (
                  <Button
                    key={bp.value}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBreakpoint(bp.value)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              Viewport:{" "}
              {viewportMode === "fit"
                ? "Fit to container"
                : `${playgroundWidth}px`}
            </div>
          </div>

          <div ref={canvasOuterRef} className="p-3 sm:p-4 md:p-6 overflow-auto">
            <div
              className="relative rounded-lg border overflow-hidden mx-auto"
              style={{
                width: viewportMode === "fit" ? "100%" : playgroundWidth,
                height: 560,
                background:
                  config.playgroundBackground === "transparent"
                    ? "transparent"
                    : config.playgroundBackground === "solid"
                    ? config.playgroundBackgroundColor
                    : `linear-gradient(135deg, ${config.playgroundGradientFrom}, ${config.playgroundGradientTo})`,
              }}
              onMouseMove={onCanvasMove}
              onMouseUp={onCanvasUp}
              onMouseLeave={onCanvasUp}
            >
              {/* Grid */}
              {config.playgroundGrid && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, ${hexToRgba(
                        config.playgroundGridColor,
                        config.playgroundGridOpacity
                      )} 1px, transparent 1px),
                      linear-gradient(to bottom, ${hexToRgba(
                        config.playgroundGridColor,
                        config.playgroundGridOpacity
                      )} 1px, transparent 1px)
                    `,
                    backgroundSize: `${config.playgroundGridSize}px ${config.playgroundGridSize}px`,
                    zIndex: 0,
                  }}
                />
              )}

              {/* Arrow */}
              <CurvedArrow
                startElement={startRef}
                endElement={endRef}
                obstacleElements={config.showObstacles ? obstacleRefs : []}
                startPosition={startPosition as any}
                endPosition={endPosition as any}
                curveType={config.curveType as any}
                curveDirection={config.curveDirection as any}
                curveIntensity={config.curveIntensity}
                strokeWidth={config.strokeWidth}
                variant={config.variant as any}
                size={config.size as any}
                animated={config.animated}
                animationDuration={config.animationDuration}
                animationDirection={config.animationDirection as any}
                animationDelay={config.animationDelay}
                gradientFrom={
                  config.useGradient ? config.gradientFrom : config.solidColor
                }
                gradientTo={
                  config.useGradient ? config.gradientTo : config.solidColor
                }
                showStartArrow={config.showStartArrow}
                showEndArrow={config.showEndArrow}
                startArrowShape={config.startArrowShape as any}
                endArrowShape={config.endArrowShape as any}
                startArrowRotation={config.startArrowRotation}
                endArrowRotation={config.endArrowRotation}
                startArrowSize={config.startArrowSize}
                endArrowSize={config.endArrowSize}
                startArrowStrokeWidth={config.startArrowStrokeWidth}
                endArrowStrokeWidth={config.endArrowStrokeWidth}
                startArrowOpacity={config.startArrowOpacity}
                endArrowOpacity={config.endArrowOpacity}
                startArrowStrokeColor={config.startArrowStrokeColor}
                endArrowStrokeColor={config.endArrowStrokeColor}
                startArrowFillColor={config.startArrowFillColor}
                endArrowFillColor={config.endArrowFillColor}
                startArrowFilled={config.startArrowFilled}
                endArrowFilled={config.endArrowFilled}
                startHeadLayer={config.startHeadLayer}
                endHeadLayer={config.endHeadLayer}
                startLineOverHead={config.startLineOverHead === "over"}
                endLineOverHead={config.endLineOverHead === "over"}
              />

              {/* Elements */}
              {elements.map((el) => (
                <div
                  key={el.id}
                  id={el.id}
                  ref={
                    el.id === "start"
                      ? startRef
                      : el.id === "end"
                      ? endRef
                      : undefined
                  }
                  style={getElementStyle(el)}
                  onMouseDown={(e) => onCanvasMouseDown(e, el.id, "element")}
                  role="button"
                  aria-label={`${el.label} draggable`}
                >
                  <span
                    className={`px-2 py-1 rounded ${
                      selectedElement === el.id ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ background: "transparent" }}
                  >
                    {el.label}
                  </span>
                </div>
              ))}

              {/* Obstacles */}
              {config.showObstacles &&
                obstacles.map((o, idx) => (
                  <div
                    key={o.id}
                    id={o.id}
                    ref={[obstacle1Ref, obstacle2Ref, obstacle3Ref][idx] as any}
                    style={{ ...getElementStyle(o), zIndex: 1, cursor: "grab" }}
                    onMouseDown={(e) => onCanvasMouseDown(e, o.id, "obstacle")}
                  >
                    <span
                      className={`px-2 py-1 rounded ${
                        selectedElement === o.id ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      {o.label}
                    </span>
                  </div>
                ))}
            </div>

            {/* Code export (mobile-friendly) */}
            <div className="mt-4">
              <CodeBlock
                code={generateCode()}
                language="tsx"
                filename="CurvedArrowExample.tsx"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelButton({
  icon: Icon,
  label,
  panelKey,
}: {
  icon: React.ComponentType<any>;
  label: string;
  panelKey: PanelKey;
}) {
  const [activePanel, setActivePanel] = React.useState<PanelKey>("curve");
  useEffect(() => {
    const handler = (e: any) => setActivePanel(e.detail);
    window.addEventListener("panel-change", handler as any);
    return () => window.removeEventListener("panel-change", handler as any);
  }, []);
  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
        activePanel === panelKey
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      }`}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("panel-change", { detail: panelKey })
        )
      }
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function PanelContent(props: {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
  startPosition: string;
  setStartPosition: (v: string) => void;
  endPosition: string;
  setEndPosition: (v: string) => void;
  isStartDisabled: boolean;
  isEndDisabled: boolean;
  isObstaclesDisabled: boolean;
  obstacles: DraggableElement[];
  addObstacle: () => void;
  removeObstacle: (id: string) => void;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  elements: DraggableElement[];
  updateElement: (id: string, updates: Partial<DraggableElement>) => void;
  updateObstacle: (id: string, updates: Partial<DraggableElement>) => void;
  playgroundWidth: number;
}) {
  const {
    config,
    setConfig,
    startPosition,
    setStartPosition,
    endPosition,
    setEndPosition,
    isStartDisabled,
    isEndDisabled,
    isObstaclesDisabled,
    obstacles,
    addObstacle,
    removeObstacle,
    selectedElement,
    setSelectedElement,
    elements,
    updateElement,
    updateObstacle,
    playgroundWidth,
  } = props;
  const [activePanel, setActivePanel] = React.useState<PanelKey>("curve");

  useEffect(() => {
    const handler = (e: any) => setActivePanel(e.detail);
    window.addEventListener("panel-change", handler as any);
    return () => window.removeEventListener("panel-change", handler as any);
  }, []);

  const sectionDisabledClass = "opacity-50 pointer-events-none select-none";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6">
        {activePanel === "curve" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Curve Properties</h3>
            <div className="space-y-2">
              <Label>Curve Type</Label>
              <Select
                value={config.curveType}
                onValueChange={(v: any) =>
                  setConfig((p: any) => ({ ...p, curveType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {[
                    "smooth",
                    "dramatic",
                    "s-curve",
                    "wave",
                    "around-obstacle",
                    "shortest-path",
                    "zigzag",
                    "elegant",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Curve Direction</Label>
              <Select
                value={config.curveDirection}
                onValueChange={(v: any) =>
                  setConfig((p: any) => ({ ...p, curveDirection: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="up">Up</SelectItem>
                  <SelectItem value="down">Down</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Curve Intensity: {config.curveIntensity.toFixed(1)}</Label>
              <Slider
                value={[config.curveIntensity]}
                onValueChange={([v]) =>
                  setConfig((p: any) => ({ ...p, curveIntensity: v }))
                }
                min={0.1}
                max={2.0}
                step={0.1}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Connection Points</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Position</Label>
                  <Select
                    value={startPosition}
                    onValueChange={(v: any) => setStartPosition(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {positionOptions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Position</Label>
                  <Select
                    value={endPosition}
                    onValueChange={(v: any) => setEndPosition(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {positionOptions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Obstacles</h3>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.showObstacles}
                  onCheckedChange={(checked) =>
                    setConfig((p: any) => ({ ...p, showObstacles: checked }))
                  }
                />
                <Label>Show Obstacles</Label>
              </div>

              <div
                className={isObstaclesDisabled ? sectionDisabledClass : ""}
                aria-disabled={isObstaclesDisabled}
              >
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Obstacles</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addObstacle}
                    disabled={isObstaclesDisabled}
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-1 mt-2">
                  {obstacles.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <Button
                        variant={selectedElement === o.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedElement(o.id)}
                        className="flex-1 justify-start"
                        disabled={isObstaclesDisabled}
                      >
                        {o.label}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObstacle(o.id)}
                        className="h-6 w-6 p-0"
                        disabled={isObstaclesDisabled}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === "style" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-sm">Line Style</h3>
            <div className="space-y-2">
              <Label>Variant</Label>
              <Select
                value={config.variant}
                onValueChange={(v: any) =>
                  setConfig((p: any) => ({ ...p, variant: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {variants.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Select
                value={config.size}
                onValueChange={(v: any) =>
                  setConfig((p: any) => ({ ...p, size: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stroke Width: {config.strokeWidth}px</Label>
              <Slider
                value={[config.strokeWidth]}
                onValueChange={([v]) =>
                  setConfig((p: any) => ({ ...p, strokeWidth: v }))
                }
                min={1}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Colors</h3>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.useGradient}
                  onCheckedChange={(checked) =>
                    setConfig((p: any) => ({ ...p, useGradient: checked }))
                  }
                />
                <Label>Use Gradient</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={!config.useGradient ? "opacity-50" : ""}>
                  <Label>Gradient From</Label>
                  <Input
                    type="color"
                    value={config.gradientFrom}
                    onChange={(e) =>
                      setConfig((p: any) => ({
                        ...p,
                        gradientFrom: e.target.value,
                      }))
                    }
                    className="h-10"
                    disabled={!config.useGradient}
                  />
                </div>
                <div className={!config.useGradient ? "opacity-50" : ""}>
                  <Label>Gradient To</Label>
                  <Input
                    type="color"
                    value={config.gradientTo}
                    onChange={(e) =>
                      setConfig((p: any) => ({
                        ...p,
                        gradientTo: e.target.value,
                      }))
                    }
                    className="h-10"
                    disabled={!config.useGradient}
                  />
                </div>
              </div>

              <div className={config.useGradient ? "opacity-50" : ""}>
                <Label>Solid Color</Label>
                <Input
                  type="color"
                  value={config.solidColor}
                  onChange={(e) =>
                    setConfig((p: any) => ({
                      ...p,
                      solidColor: e.target.value,
                    }))
                  }
                  className="h-10"
                  disabled={config.useGradient}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Animation</h3>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.animated}
                  onCheckedChange={(checked) =>
                    setConfig((p: any) => ({ ...p, animated: checked }))
                  }
                />
                <Label>Animated</Label>
              </div>
              <div
                className={
                  !config.animated ? "opacity-50 pointer-events-none" : ""
                }
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={config.animationDuration}
                      onChange={(e) =>
                        setConfig((p: any) => ({
                          ...p,
                          animationDuration: e.target.value,
                        }))
                      }
                      placeholder="2s"
                      disabled={!config.animated}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Direction</Label>
                    <Select
                      value={config.animationDirection}
                      onValueChange={(v: any) =>
                        setConfig((p: any) => ({ ...p, animationDirection: v }))
                      }
                      disabled={!config.animated}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forward">Forward</SelectItem>
                        <SelectItem value="reverse">Reverse</SelectItem>
                        <SelectItem value="alternate">Alternate</SelectItem>
                        <SelectItem value="alternate-reverse">
                          Alternate Reverse
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Delay</Label>
                    <Input
                      value={config.animationDelay}
                      onChange={(e) =>
                        setConfig((p: any) => ({
                          ...p,
                          animationDelay: e.target.value,
                        }))
                      }
                      placeholder="0s"
                      disabled={!config.animated}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === "arrows" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Arrow Visibility</h3>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.showStartArrow}
                  onCheckedChange={(checked) =>
                    setConfig((p: any) => ({ ...p, showStartArrow: checked }))
                  }
                />
                <Label>Show Start Arrow</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.showEndArrow}
                  onCheckedChange={(checked) =>
                    setConfig((p: any) => ({ ...p, showEndArrow: checked }))
                  }
                />
                <Label>Show End Arrow</Label>
              </div>
            </div>

            {/* Start Arrow */}
            <div
              className={`space-y-4 p-4 border rounded-lg ${
                !config.showStartArrow ? "opacity-50" : ""
              }`}
            >
              <h3 className="font-semibold text-sm">Start Arrow (Tail)</h3>

              <div className="space-y-2">
                <Label>Shape</Label>
                <Select
                  value={config.startArrowShape}
                  onValueChange={(v: any) =>
                    setConfig((p: any) => ({ ...p, startArrowShape: v }))
                  }
                  disabled={!config.showStartArrow}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {arrowShapes.map((shape) => (
                      <SelectItem key={shape} value={shape}>
                        {shape}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Head Layer vs Elements
                  </Label>
                  <Select
                    value={config.startHeadLayer}
                    onValueChange={(v: "over" | "under") =>
                      setConfig((p: any) => ({ ...p, startHeadLayer: v }))
                    }
                    disabled={!config.showStartArrow}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Layer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="over">Over elements</SelectItem>
                      <SelectItem value="under">Under elements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Line vs Head (Start)</Label>
                  <Select
                    value={config.startLineOverHead}
                    onValueChange={(v: "under" | "over") =>
                      setConfig((p: any) => ({ ...p, startLineOverHead: v }))
                    }
                    disabled={!config.showStartArrow}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under">
                        Line under head (default)
                      </SelectItem>
                      <SelectItem value="over">Line over head</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fill Arrowhead</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.startArrowFilled}
                    onCheckedChange={(checked) =>
                      setConfig((p: any) => ({
                        ...p,
                        startArrowFilled: checked,
                      }))
                    }
                    disabled={!config.showStartArrow}
                  />
                  <span className="text-xs text-muted-foreground">
                    Force fill regardless of shape
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Size: {config.startArrowSize}px</Label>
                  <Slider
                    value={[config.startArrowSize]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, startArrowSize: v }))
                    }
                    min={8}
                    max={50}
                    step={2}
                    disabled={!config.showStartArrow}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rotation: {config.startArrowRotation}°</Label>
                  <Slider
                    value={[config.startArrowRotation]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, startArrowRotation: v }))
                    }
                    min={-180}
                    max={180}
                    step={15}
                    disabled={!config.showStartArrow}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stroke Width: {config.startArrowStrokeWidth}px</Label>
                  <Slider
                    value={[config.startArrowStrokeWidth]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({
                        ...p,
                        startArrowStrokeWidth: v,
                      }))
                    }
                    min={1}
                    max={10}
                    step={1}
                    disabled={!config.showStartArrow}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Opacity: {config.startArrowOpacity.toFixed(2)}</Label>
                  <Slider
                    value={[config.startArrowOpacity]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, startArrowOpacity: v }))
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    disabled={!config.showStartArrow}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stroke Color</Label>
                  <Input
                    type="color"
                    value={config.startArrowStrokeColor}
                    onChange={(e) =>
                      setConfig((p: any) => ({
                        ...p,
                        startArrowStrokeColor: e.target.value,
                      }))
                    }
                    className="h-10"
                    disabled={!config.showStartArrow}
                  />
                </div>
                <div className={config.startArrowFilled ? "" : "opacity-50"}>
                  <Label>Fill Color</Label>
                  <Input
                    type="color"
                    value={config.startArrowFillColor}
                    onChange={(e) =>
                      setConfig((p: any) => ({
                        ...p,
                        startArrowFillColor: e.target.value,
                      }))
                    }
                    className="h-10"
                    disabled={
                      !config.showStartArrow || !config.startArrowFilled
                    }
                  />
                </div>
              </div>
            </div>

            {/* End Arrow */}
            <div
              className={`space-y-4 p-4 border rounded-lg ${
                !config.showEndArrow ? "opacity-50" : ""
              }`}
            >
              <h3 className="font-semibold text-sm">End Arrow (Head)</h3>

              <div className="space-y-2">
                <Label>Shape</Label>
                <Select
                  value={config.endArrowShape}
                  onValueChange={(v: any) =>
                    setConfig((p: any) => ({ ...p, endArrowShape: v }))
                  }
                  disabled={!config.showEndArrow}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {arrowShapes.map((shape) => (
                      <SelectItem key={shape} value={shape}>
                        {shape}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Head Layer vs Elements
                  </Label>
                  <Select
                    value={config.endHeadLayer}
                    onValueChange={(v: "over" | "under") =>
                      setConfig((p: any) => ({ ...p, endHeadLayer: v }))
                    }
                    disabled={!config.showEndArrow}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Layer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="over">Over elements</SelectItem>
                      <SelectItem value="under">Under elements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Line vs Head (End)</Label>
                  <Select
                    value={config.endLineOverHead}
                    onValueChange={(v: "under" | "over") =>
                      setConfig((p: any) => ({ ...p, endLineOverHead: v }))
                    }
                    disabled={!config.showEndArrow}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under">
                        Line under head (default)
                      </SelectItem>
                      <SelectItem value="over">Line over head</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fill Arrowhead</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.endArrowFilled}
                    onCheckedChange={(checked) =>
                      setConfig((p: any) => ({ ...p, endArrowFilled: checked }))
                    }
                    disabled={!config.showEndArrow}
                  />
                  <span className="text-xs text-muted-foreground">
                    Force fill regardless of shape
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Size: {config.endArrowSize}px</Label>
                  <Slider
                    value={[config.endArrowSize]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, endArrowSize: v }))
                    }
                    min={8}
                    max={50}
                    step={2}
                    disabled={!config.showEndArrow}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rotation: {config.endArrowRotation}°</Label>
                  <Slider
                    value={[config.endArrowRotation]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, endArrowRotation: v }))
                    }
                    min={-180}
                    max={180}
                    step={15}
                    disabled={!config.showEndArrow}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stroke Width: {config.endArrowStrokeWidth}px</Label>
                  <Slider
                    value={[config.endArrowStrokeWidth]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, endArrowStrokeWidth: v }))
                    }
                    min={1}
                    max={10}
                    step={1}
                    disabled={!config.showEndArrow}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Opacity: {config.endArrowOpacity.toFixed(2)}</Label>
                  <Slider
                    value={[config.endArrowOpacity]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, endArrowOpacity: v }))
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    disabled={!config.showEndArrow}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stroke Color</Label>
                  <Input
                    type="color"
                    value={config.endArrowStrokeColor}
                    onChange={(e) =>
                      setConfig((p: any) => ({
                        ...p,
                        endArrowStrokeColor: e.target.value,
                      }))
                    }
                    className="h-10"
                    disabled={!config.showEndArrow}
                  />
                </div>
                <div className={config.endArrowFilled ? "" : "opacity-50"}>
                  <Label>Fill Color</Label>
                  <Input
                    type="color"
                    value={config.endArrowFillColor}
                    onChange={(e) =>
                      setConfig((p: any) => ({
                        ...p,
                        endArrowFillColor: e.target.value,
                      }))
                    }
                    className="h-10"
                    disabled={!config.showEndArrow || !config.endArrowFilled}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activePanel === "elements" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">
                Element Layering vs Arrow
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Start Element</Label>
                  <Select
                    value={config.startElementLayer}
                    onValueChange={(v: "under" | "over") =>
                      setConfig((p: any) => ({ ...p, startElementLayer: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under">Under arrow</SelectItem>
                      <SelectItem value="over">Over arrow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>End Element</Label>
                  <Select
                    value={config.endElementLayer}
                    onValueChange={(v: "under" | "over") =>
                      setConfig((p: any) => ({ ...p, endElementLayer: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under">Under arrow</SelectItem>
                      <SelectItem value="over">Over arrow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Element Selection</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedElement === "start" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedElement("start")}
                >
                  Start Element
                </Button>
                <Button
                  variant={selectedElement === "end" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedElement("end")}
                >
                  End Element
                </Button>
              </div>
              {props.obstacles.map((o) => (
                <Button
                  key={o.id}
                  variant={selectedElement === o.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => props.setSelectedElement(o.id)}
                  className="w-full"
                >
                  {o.label}
                </Button>
              ))}

              {selectedElement && (
                <ElementEditor
                  element={
                    props.elements.find((e) => e.id === selectedElement) ||
                    props.obstacles.find((e) => e.id === selectedElement)!
                  }
                  selectedElement={selectedElement}
                  elements={props.elements}
                  updateElement={props.updateElement}
                  updateObstacle={props.updateObstacle}
                  playgroundWidth={playgroundWidth}
                />
              )}
            </div>
          </div>
        )}

        {activePanel === "canvas" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Canvas Settings</h3>
            <div className="space-y-2">
              <Label>Background Type</Label>
              <Select
                value={config.playgroundBackground}
                onValueChange={(v: any) =>
                  setConfig((p: any) => ({ ...p, playgroundBackground: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="transparent">Transparent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              className={
                config.playgroundBackground === "solid" ? "" : "opacity-50"
              }
            >
              <Label>Background Color</Label>
              <Input
                type="color"
                value={config.playgroundBackgroundColor}
                onChange={(e) =>
                  setConfig((p: any) => ({
                    ...p,
                    playgroundBackgroundColor: e.target.value,
                  }))
                }
                className="h-10"
                disabled={config.playgroundBackground !== "solid"}
              />
            </div>

            <div
              className={`grid grid-cols-2 gap-4 ${
                config.playgroundBackground === "gradient" ? "" : "opacity-50"
              }`}
            >
              <div className="space-y-2">
                <Label>Gradient From</Label>
                <Input
                  type="color"
                  value={config.playgroundGradientFrom}
                  onChange={(e) =>
                    setConfig((p: any) => ({
                      ...p,
                      playgroundGradientFrom: e.target.value,
                    }))
                  }
                  className="h-10"
                  disabled={config.playgroundBackground !== "gradient"}
                />
              </div>
              <div className="space-y-2">
                <Label>Gradient To</Label>
                <Input
                  type="color"
                  value={config.playgroundGradientTo}
                  onChange={(e) =>
                    setConfig((p: any) => ({
                      ...p,
                      playgroundGradientTo: e.target.value,
                    }))
                  }
                  className="h-10"
                  disabled={config.playgroundBackground !== "gradient"}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={config.playgroundGrid}
                onCheckedChange={(checked) =>
                  setConfig((p: any) => ({ ...p, playgroundGrid: checked }))
                }
              />
              <Label>Show Grid</Label>
            </div>

            <div
              className={
                !config.playgroundGrid ? "opacity-50 pointer-events-none" : ""
              }
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Grid Size: {config.playgroundGridSize}px</Label>
                  <Slider
                    value={[config.playgroundGridSize]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({ ...p, playgroundGridSize: v }))
                    }
                    min={8}
                    max={64}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grid Color</Label>
                  <Input
                    type="color"
                    value={config.playgroundGridColor}
                    onChange={(e) =>
                      setConfig((p: any) => ({
                        ...p,
                        playgroundGridColor: e.target.value,
                      }))
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Grid Opacity: {config.playgroundGridOpacity.toFixed(2)}
                  </Label>
                  <Slider
                    value={[config.playgroundGridOpacity]}
                    onValueChange={([v]) =>
                      setConfig((p: any) => ({
                        ...p,
                        playgroundGridOpacity: v,
                      }))
                    }
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ElementEditor({
  element,
  selectedElement,
  elements,
  updateElement,
  updateObstacle,
  playgroundWidth,
}: {
  element: DraggableElement;
  selectedElement: string;
  elements: DraggableElement[];
  updateElement: (id: string, updates: Partial<DraggableElement>) => void;
  updateObstacle: (id: string, updates: Partial<DraggableElement>) => void;
  playgroundWidth: number;
}) {
  const isMain = !!elements.find((el) => el.id === selectedElement);
  const apply = (updates: Partial<DraggableElement>) =>
    isMain
      ? updateElement(selectedElement, updates)
      : updateObstacle(selectedElement, updates);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold text-sm">Customize {element.label}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>X Position: {element.x}px</Label>
          <Slider
            value={[element.x]}
            onValueChange={([v]) => apply({ x: v })}
            min={0}
            max={playgroundWidth - element.width}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Y Position: {element.y}px</Label>
          <Slider
            value={[element.y]}
            onValueChange={([v]) => apply({ y: v })}
            min={0}
            max={520}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Width: {element.width}px</Label>
          <Slider
            value={[element.width]}
            onValueChange={([v]) => apply({ width: v })}
            min={40}
            max={260}
            step={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Height: {element.height}px</Label>
          <Slider
            value={[element.height]}
            onValueChange={([v]) => apply({ height: v })}
            min={32}
            max={180}
            step={2}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Rotation: {element.rotation}°</Label>
        <Slider
          value={[element.rotation]}
          onValueChange={([v]) => apply({ rotation: v })}
          min={-180}
          max={180}
          step={15}
        />
      </div>

      <div className="space-y-2">
        <Label>Label</Label>
        <Input
          value={element.label}
          onChange={(e) => apply({ label: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Background Color</Label>
          <Input
            type="color"
            value={element.backgroundColor}
            onChange={(e) => apply({ backgroundColor: e.target.value })}
            className="h-10"
          />
        </div>
        <div className="space-y-2">
          <Label>Text Color</Label>
          <Input
            type="color"
            value={element.textColor}
            onChange={(e) => apply({ textColor: e.target.value })}
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Font Size: {element.fontSize}px</Label>
          <Slider
            value={[element.fontSize]}
            onValueChange={([v]) => apply({ fontSize: v })}
            min={10}
            max={24}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Opacity: {element.opacity.toFixed(2)}</Label>
          <Slider
            value={[element.opacity]}
            onValueChange={([v]) => apply({ opacity: v })}
            min={0}
            max={1}
            step={0.05}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Border Radius: {element.borderRadius}px</Label>
          <Slider
            value={[element.borderRadius]}
            onValueChange={([v]) => apply({ borderRadius: v })}
            min={0}
            max={50}
            step={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Border Width: {element.borderWidth}px</Label>
          <Slider
            value={[element.borderWidth]}
            onValueChange={([v]) => apply({ borderWidth: v })}
            min={0}
            max={10}
            step={1}
          />
        </div>
        {element.borderWidth > 0 && (
          <div className="space-y-2 col-span-2">
            <Label>Border Color</Label>
            <Input
              type="color"
              value={element.borderColor}
              onChange={(e) => apply({ borderColor: e.target.value })}
              className="h-10"
            />
          </div>
        )}
      </div>
    </div>
  );
}
