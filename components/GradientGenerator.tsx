import React, { useState, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Slider } from "./ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Trash2,
  Plus,
  Copy,
  Check,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { HexColorPicker } from "react-colorful";
import { ThemeToggle } from "./ThemeToggle";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

type GradientType = "linear" | "radial" | "conic";
type InterpolationMode =
  | "srgb"
  | "hsl"
  | "oklab"
  | "oklch"
  | "longer"
  | "shorter"
  | "increasing"
  | "decreasing"
  | "none";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div
          className="w-12 h-12 border-2 border-border cursor-pointer rounded-md flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ backgroundColor: color }}
          aria-label="Pick color"
          role="button"
        >
          <Palette className="w-4 h-4 text-white drop-shadow-sm" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-3">
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ width: "200px", height: "150px" }}
          />
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border border-border"
              style={{ backgroundColor: color }}
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const GradientGenerator: React.FC = () => {
  const [gradientType, setGradientType] =
    useState<GradientType>("linear");
  const [angle, setAngle] = useState(0);
  const [radialShape, setRadialShape] = useState<
    "circle" | "ellipse"
  >("circle");
  const [radialSize, setRadialSize] = useState<
    | "closest-side"
    | "closest-corner"
    | "farthest-side"
    | "farthest-corner"
  >("farthest-corner");
  const [radialPosition, setRadialPosition] = useState({
    x: 50,
    y: 50,
  });
  const [interpolationMode, setInterpolationMode] =
    useState<InterpolationMode>("none");
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#3b82f6", position: 0 },
    { id: "2", color: "#8b5cf6", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const addColorStop = useCallback(() => {
    const newPosition =
      colorStops.length > 0
        ? Math.round(
          (colorStops[colorStops.length - 1].position + 100) /
          2,
        )
        : 50;

    setColorStops((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        color: "#ef4444",
        position: Math.min(newPosition, 100),
      },
    ]);
  }, [colorStops]);

  const removeColorStop = useCallback(
    (id: string) => {
      if (colorStops.length <= 2) {
        toast.error("You need at least 2 color stops");
        return;
      }
      setColorStops((prev) =>
        prev.filter((stop) => stop.id !== id),
      );
    },
    [colorStops.length],
  );

  const updateColorStop = useCallback(
    (id: string, updates: Partial<ColorStop>) => {
      setColorStops((prev) =>
        prev.map((stop) =>
          stop.id === id ? { ...stop, ...updates } : stop,
        ),
      );
    },
    [],
  );

  const sortedColorStops = useMemo(() => {
    return [...colorStops].sort(
      (a, b) => a.position - b.position,
    );
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
  }, [
    gradientType,
    angle,
    radialShape,
    radialSize,
    radialPosition,
    sortedColorStops,
  ]);

  // Helper function to convert hex to Tailwind color name when possible
  const hexToTailwindColor = useCallback(
    (hex: string): string => {
      const colorMap: Record<string, string> = {
        "#ef4444": "red-500",
        "#f97316": "orange-500",
        "#f59e0b": "amber-500",
        "#eab308": "yellow-500",
        "#84cc16": "lime-500",
        "#22c55e": "green-500",
        "#10b981": "emerald-500",
        "#14b8a6": "teal-500",
        "#06b6d4": "cyan-500",
        "#0ea5e9": "sky-500",
        "#3b82f6": "blue-500",
        "#6366f1": "indigo-500",
        "#8b5cf6": "violet-500",
        "#a855f7": "purple-500",
        "#d946ef": "fuchsia-500",
        "#ec4899": "pink-500",
        "#f43f5e": "rose-500",
        "#64748b": "slate-500",
        "#6b7280": "gray-500",
        "#71717a": "zinc-500",
        "#737373": "neutral-500",
        "#78716c": "stone-500",
        "#ffffff": "white",
        "#000000": "black",
      };

      return colorMap[hex.toLowerCase()] || `[${hex}]`;
    },
    [],
  );

  const tailwindGradient = useMemo(() => {
    let baseClass = "";
    let interpolationSuffix =
      interpolationMode !== "none"
        ? `/${interpolationMode}`
        : "";

    // Generate base gradient class based on type
    switch (gradientType) {
      case "linear":
        if (angle === 0)
          baseClass = `bg-linear-to-t${interpolationSuffix}`;
        else if (angle === 45)
          baseClass = `bg-linear-to-tr${interpolationSuffix}`;
        else if (angle === 90)
          baseClass = `bg-linear-to-r${interpolationSuffix}`;
        else if (angle === 135)
          baseClass = `bg-linear-to-br${interpolationSuffix}`;
        else if (angle === 180)
          baseClass = `bg-linear-to-b${interpolationSuffix}`;
        else if (angle === 225)
          baseClass = `bg-linear-to-bl${interpolationSuffix}`;
        else if (angle === 270)
          baseClass = `bg-linear-to-l${interpolationSuffix}`;
        else if (angle === 315)
          baseClass = `bg-linear-to-tl${interpolationSuffix}`;
        else
          baseClass = `bg-linear-${angle}${interpolationSuffix}`;
        break;

      case "radial":
        if (
          radialPosition.x === 50 &&
          radialPosition.y === 50
        ) {
          baseClass = `bg-radial${interpolationSuffix}`;
        } else {
          baseClass = `bg-radial-[at_${radialPosition.x}%_${radialPosition.y}%]${interpolationSuffix}`;
        }
        break;

      case "conic":
        let conicClass = "bg-conic";
        if (angle !== 0) {
          conicClass = `bg-conic-${angle}`;
        }
        if (
          radialPosition.x !== 50 ||
          radialPosition.y !== 50
        ) {
          conicClass += `-[at_${radialPosition.x}%_${radialPosition.y}%]`;
        }
        baseClass = conicClass + interpolationSuffix;
        break;
    }

    // Generate color stops
    const colorStopClasses: string[] = [];

    sortedColorStops.forEach((stop, index) => {
      const colorClass = hexToTailwindColor(stop.color);
      let stopClass = "";

      if (index === 0) {
        // First stop - from
        stopClass = `from-${colorClass}`;
        if (stop.position !== 0) {
          stopClass += ` from-${stop.position}%`;
        }
      } else if (index === sortedColorStops.length - 1) {
        // Last stop - to
        stopClass = `to-${colorClass}`;
        if (stop.position !== 100) {
          stopClass += ` to-${stop.position}%`;
        }
      } else {
        // Middle stop - via
        stopClass = `via-${colorClass}`;
        if (stop.position !== 50) {
          stopClass += ` via-${stop.position}%`;
        }
      }

      colorStopClasses.push(stopClass);
    });

    return `${baseClass} ${colorStopClasses.join(" ")}`;
  }, [
    gradientType,
    angle,
    radialPosition,
    sortedColorStops,
    interpolationMode,
    hexToTailwindColor,
  ]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tailwindGradient);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      toast.error("Failed to copy to clipboard");
    }
  }, [tailwindGradient]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="mb-2">Gradient Generator</h1>
          <p className="text-muted-foreground">
            Create beautiful gradients and get the Tailwind CSS v4
            code
          </p>
        </div>
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Gradient Type */}
          <Card>
            <CardHeader>
              <CardTitle>Gradient Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={gradientType}
                onValueChange={(value: GradientType) =>
                  setGradientType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="conic">Conic</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Interpolation Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Interpolation Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={interpolationMode}
                onValueChange={(value: InterpolationMode) =>
                  setInterpolationMode(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Default</SelectItem>
                  <SelectItem value="srgb">sRGB</SelectItem>
                  <SelectItem value="hsl">HSL</SelectItem>
                  <SelectItem value="oklab">OKLab</SelectItem>
                  <SelectItem value="oklch">OKLCH</SelectItem>
                  <SelectItem value="longer">Longer</SelectItem>
                  <SelectItem value="shorter">
                    Shorter
                  </SelectItem>
                  <SelectItem value="increasing">
                    Increasing
                  </SelectItem>
                  <SelectItem value="decreasing">
                    Decreasing
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Direction/Angle Controls */}
          {gradientType === "linear" && (
            <Card>
              <CardHeader>
                <CardTitle>Direction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Angle: {angle}°</Label>
                  <Slider
                    value={[angle]}
                    onValueChange={(value) =>
                      setAngle(value[0])
                    }
                    max={360}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "↑", value: 0 },
                    { label: "↗", value: 45 },
                    { label: "→", value: 90 },
                    { label: "↘", value: 135 },
                    { label: "↓", value: 180 },
                    { label: "↙", value: 225 },
                    { label: "←", value: 270 },
                    { label: "↖", value: 315 },
                  ].map(({ label, value }) => (
                    <Button
                      key={value}
                      variant={
                        angle === value ? "default" : "outline"
                      }
                      onClick={() => setAngle(value)}
                      className="aspect-square p-0"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Radial Controls */}
          {gradientType === "radial" && (
            <Card>
              <CardHeader>
                <CardTitle>Radial Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Shape</Label>
                  <Select
                    value={radialShape}
                    onValueChange={(
                      value: "circle" | "ellipse",
                    ) => setRadialShape(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">
                        Circle
                      </SelectItem>
                      <SelectItem value="ellipse">
                        Ellipse
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Size</Label>
                  <Select
                    value={radialSize}
                    onValueChange={(value: typeof radialSize) =>
                      setRadialSize(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="closest-side">
                        Closest Side
                      </SelectItem>
                      <SelectItem value="closest-corner">
                        Closest Corner
                      </SelectItem>
                      <SelectItem value="farthest-side">
                        Farthest Side
                      </SelectItem>
                      <SelectItem value="farthest-corner">
                        Farthest Corner
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Position X: {radialPosition.x}%</Label>
                  <Slider
                    value={[radialPosition.x]}
                    onValueChange={(value) =>
                      setRadialPosition((prev) => ({
                        ...prev,
                        x: value[0],
                      }))
                    }
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Position Y: {radialPosition.y}%</Label>
                  <Slider
                    value={[radialPosition.y]}
                    onValueChange={(value) =>
                      setRadialPosition((prev) => ({
                        ...prev,
                        y: value[0],
                      }))
                    }
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conic Controls */}
          {gradientType === "conic" && (
            <Card>
              <CardHeader>
                <CardTitle>Conic Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Start Angle: {angle}°</Label>
                  <Slider
                    value={[angle]}
                    onValueChange={(value) =>
                      setAngle(value[0])
                    }
                    max={360}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Center X: {radialPosition.x}%</Label>
                  <Slider
                    value={[radialPosition.x]}
                    onValueChange={(value) =>
                      setRadialPosition((prev) => ({
                        ...prev,
                        x: value[0],
                      }))
                    }
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Center Y: {radialPosition.y}%</Label>
                  <Slider
                    value={[radialPosition.y]}
                    onValueChange={(value) =>
                      setRadialPosition((prev) => ({
                        ...prev,
                        y: value[0],
                      }))
                    }
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Color Stops */}
          <Card>
            <CardHeader>
              <CardTitle>Color Stops</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {colorStops.map((stop) => (
                <div
                  key={stop.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <ColorPicker
                    color={stop.color}
                    onChange={(color) =>
                      updateColorStop(stop.id, { color })
                    }
                  />
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={stop.color}
                      onChange={(e) =>
                        updateColorStop(stop.id, {
                          color: e.target.value,
                        })
                      }
                      placeholder="#000000"
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      value={stop.position}
                      onChange={(e) =>
                        updateColorStop(stop.id, {
                          position: Number(e.target.value),
                        })
                      }
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    %
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColorStop(stop.id)}
                    disabled={colorStops.length <= 2}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={addColorStop}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Color Stop
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Output */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-64 rounded-lg border"
                style={{ background: cssGradient }}
              />
            </CardContent>
          </Card>

          {/* CSS Output */}
          <Card>
            <CardHeader>
              <CardTitle>CSS Gradient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
                  <code>{cssGradient}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    navigator.clipboard.writeText(cssGradient)
                  }
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tailwind Output */}
          <Card>
            <CardHeader>
              <CardTitle>Tailwind CSS v4</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-3 bg-muted rounded text-sm overflow-x-auto whitespace-pre-wrap break-words">
                  <code>{tailwindGradient}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Example Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
                  <code>{`<div class="${tailwindGradient}">
  Your content here
</div>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradientGenerator;
