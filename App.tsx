import { useState, useMemo } from "react";
import GradientGenerator from './components/GradientGenerator';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ThemeProvider';
interface ColorStop {
  id: string;
  color: string;
  position: number;
}

type GradientType = "linear" | "radial" | "conic";

export default function App() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(0);
  const [radialShape, setRadialShape] = useState<"circle" | "ellipse">("circle");
  const [radialSize, setRadialSize] = useState<
    "closest-side" | "closest-corner" | "farthest-side" | "farthest-corner"
  >("farthest-corner");
  const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 });
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#3b82f6", position: 0 },
    { id: "2", color: "#8b5cf6", position: 100 },
  ]);

  const sortedColorStops = useMemo(() => {
    return [...colorStops].sort((a, b) => a.position - b.position);
  }, [colorStops]);

  const cssGradient = useMemo(() => {
    const colorStopsStr = sortedColorStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${colorStopsStr})`;
      case "radial":
        const position = `${radialPosition.x}% ${radialPosition.y}%`;
        return `radial-gradient(${radialShape} ${radialSize} at ${position}, ${colorStopsStr})`;
      case "conic":
        return `conic-gradient(from ${angle}deg at ${radialPosition.x}% ${radialPosition.y}%, ${colorStopsStr})`;
      default:
        return "";
    }
  }, [gradientType, angle, radialShape, radialSize, radialPosition, sortedColorStops]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="gradient-app-theme">
      <div className="min-h-screen bg-background">
        <GradientGenerator
          gradientType={gradientType}
          setGradientType={setGradientType}
          angle={angle}
          setAngle={setAngle}
          radialShape={radialShape}
          setRadialShape={setRadialShape}
          radialSize={radialSize}
          setRadialSize={setRadialSize}
          radialPosition={radialPosition}
          setRadialPosition={setRadialPosition}
          colorStops={colorStops}
          setColorStops={setColorStops}
          cssGradient={cssGradient}
        />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
