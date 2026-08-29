import { lineColorHex, type LineTheme } from "../data/lineThemes";

type InvoiceRuleProps = {
  theme: LineTheme;
  compact?: boolean;
};

export function InvoiceRule({ theme, compact = false }: InvoiceRuleProps) {
  const gold = lineColorHex("gold");
  const ink = lineColorHex("ink");

  if (theme === "split") {
    return (
      <div
        className={`brand-mark flex ${compact ? "h-3 items-center" : "mb-8 h-[3px]"} w-full`}
        aria-hidden="true"
      >
        <span
          className={compact ? "h-[3px] w-[58%]" : "h-full w-[58%]"}
          style={{ backgroundColor: ink }}
        />
        <span
          className={compact ? "h-[3px] w-[42%]" : "h-full w-[42%]"}
          style={{ backgroundColor: gold }}
        />
      </div>
    );
  }

  if (theme === "duo") {
    return (
      <div
        className={`brand-mark flex flex-col justify-center gap-[3px] ${compact ? "h-3" : "mb-8 gap-1"}`}
        aria-hidden="true"
      >
        <div className="h-[2px] w-full" style={{ backgroundColor: ink }} />
        <div className="h-[2px] w-full" style={{ backgroundColor: gold }} />
      </div>
    );
  }

  return (
    <div
      className={`brand-mark flex flex-col justify-center gap-[3px] ${compact ? "h-3" : "mb-8 gap-1"}`}
      aria-hidden="true"
    >
      <div className="h-[2px] w-full" style={{ backgroundColor: gold }} />
      <div className="h-[2px] w-full" style={{ backgroundColor: gold }} />
    </div>
  );
}
