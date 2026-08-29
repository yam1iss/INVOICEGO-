import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDismiss } from "../hooks/useDismiss";
import { formatDate } from "../utils/format";
import { controlClassName } from "./controlStyles";

type DatePickerProps = {
  id: string;
  value: string;
  onChange: (iso: string) => void;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({ id, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<DOMRect | null>(null);
  const selected = parseIso(value) ?? new Date();
  const [cursor, setCursor] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );

  useDismiss(open, () => setOpen(false), [buttonRef, menuRef]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (buttonRef.current) setCoords(buttonRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  const cells = useMemo(() => monthCells(cursor), [cursor]);
  const menuWidth = coords ? Math.max(coords.width, 288) : 288;
  const left = coords
    ? Math.min(coords.left, window.innerWidth - menuWidth - 8)
    : 0;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setCursor(new Date(selected.getFullYear(), selected.getMonth(), 1));
          setOpen((current) => !current);
        }}
        className={`${controlClassName} flex items-center justify-between gap-2 text-left`}
      >
        <span>{value ? formatDate(value) : "Select date"}</span>
        <CalendarIcon />
      </button>
      {open && coords
        ? createPortal(
            <div
              ref={menuRef}
              role="dialog"
              aria-label="Choose date"
              className="fixed z-[80] rounded-md border border-line bg-white p-3 shadow-[0_8px_24px_rgba(10,10,10,0.1)]"
              style={{
                top: coords.bottom + 4,
                left,
                width: menuWidth,
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink hover:bg-field focus-visible:outline-2 focus-visible:outline-ink"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
                    )
                  }
                >
                  <NavIcon direction="prev" />
                </button>
                <p className="text-sm font-semibold text-ink">
                  {cursor.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <button
                  type="button"
                  aria-label="Next month"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink hover:bg-field focus-visible:outline-2 focus-visible:outline-ink"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
                    )
                  }
                >
                  <NavIcon direction="next" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted"
                  >
                    {day}
                  </div>
                ))}
                {cells.map((cell, index) => {
                  if (!cell) {
                    return <div key={`empty-${index}`} />;
                  }
                  const iso = toIso(cell);
                  const isSelected = iso === value;
                  const isToday = iso === toIso(new Date());
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-md text-sm tabular-nums touch-manipulation ${
                        isSelected
                          ? "bg-accent font-semibold text-ink"
                          : isToday
                            ? "font-semibold text-ink ring-1 ring-line-strong hover:bg-field"
                            : "text-ink hover:bg-field"
                      }`}
                      onClick={() => {
                        onChange(iso);
                        setOpen(false);
                      }}
                    >
                      {cell.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function parseIso(iso: string): Date | null {
  if (!iso) return null;
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthCells(cursor: Date): Array<Date | null> {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }
  return cells;
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-ink-muted"
    >
      <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" />
      <path d="M2 6.5h12" stroke="currentColor" />
      <path d="M5 2v2M11 2v2" stroke="currentColor" strokeLinecap="square" />
    </svg>
  );
}

function NavIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={direction === "prev" ? "M8.5 3L4.5 7l4 4" : "M5.5 3L9.5 7l-4 4"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
