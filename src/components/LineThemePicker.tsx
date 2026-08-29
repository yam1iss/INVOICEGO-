import { LINE_THEMES, type LineTheme } from "../data/lineThemes";
import { InvoiceRule } from "./InvoiceRule";

type LineThemePickerProps = {
  theme: LineTheme;
  onThemeChange: (theme: LineTheme) => void;
};

export function LineThemePicker({
  theme,
  onThemeChange,
}: LineThemePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span id="line-theme-label" className="text-[13px] font-medium text-ink">
        Top rule
      </span>
      <div
        role="radiogroup"
        aria-labelledby="line-theme-label"
        className="grid grid-cols-3 gap-2"
      >
        {LINE_THEMES.map((option) => {
          const selected = option.id === theme;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onThemeChange(option.id)}
              className={`flex flex-col gap-2 rounded-[2px] border px-2.5 py-2.5 text-left touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                selected
                  ? "border-ink bg-field"
                  : "border-line bg-white hover:border-line-strong"
              }`}
            >
              <InvoiceRule theme={option.id} compact />
              <span className="text-[11px] font-medium text-ink">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
