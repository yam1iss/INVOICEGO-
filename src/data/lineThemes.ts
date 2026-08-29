export type LineTheme = "split" | "double" | "duo";

export type LineColor = "gold" | "ink" | "brick" | "forest" | "navy" | "stone";

export type LineThemeOption = {
  id: LineTheme;
  label: string;
};

export type LineColorOption = {
  id: LineColor;
  label: string;
  hex: string;
};

export const LINE_THEMES: LineThemeOption[] = [
  { id: "split", label: "Split" },
  { id: "double", label: "Double" },
  { id: "duo", label: "Duo" },
];

export const LINE_COLORS: LineColorOption[] = [
  { id: "gold", label: "Gold", hex: "#F5C400" },
  { id: "ink", label: "Black", hex: "#0A0A0A" },
];

export function isLineTheme(value: string): value is LineTheme {
  return LINE_THEMES.some((theme) => theme.id === value);
}

export function isLineColor(value: string): value is LineColor {
  return LINE_COLORS.some((color) => color.id === value);
}

export function lineColorHex(color: LineColor): string {
  return LINE_COLORS.find((option) => option.id === color)?.hex ?? "#F5C400";
}

export function migrateLineTheme(value: string): {
  theme?: LineTheme;
  color?: LineColor;
} {
  if (value === "gold" || value === "full" || value === "short") {
    return { theme: "double", color: "gold" };
  }
  if (value === "ink") return { theme: "split", color: "gold" };
  if (isLineTheme(value)) return { theme: value, color: "gold" };
  return {};
}
