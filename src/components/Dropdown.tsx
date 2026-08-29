import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDismiss } from "../hooks/useDismiss";
import { controlClassName } from "./controlStyles";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  id: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
};

export function Dropdown({ id, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [coords, setCoords] = useState<DOMRect | null>(null);
  const selected = options.find((option) => option.value === value);

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

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`${controlClassName} flex items-center justify-between gap-2 text-left`}
      >
        <span className="min-w-0 truncate">
          {selected?.label ?? "Select"}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && coords
        ? createPortal(
            <ul
              ref={menuRef}
              role="listbox"
              aria-labelledby={id}
              className="fixed z-[80] max-h-64 overflow-auto rounded-md border border-line bg-white py-1 shadow-[0_8px_24px_rgba(10,10,10,0.1)]"
              style={{
                top: coords.bottom + 4,
                left: coords.left,
                width: coords.width,
              }}
            >
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <li key={option.value} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      className={`flex w-full px-3.5 py-2.5 text-left text-sm touch-manipulation ${
                        isActive
                          ? "bg-accent font-medium text-ink"
                          : "text-ink hover:bg-field"
                      }`}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
