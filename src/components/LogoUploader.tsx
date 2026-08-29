import { useRef, useState, type DragEvent } from "react";
import { isMoondevWordmark } from "../data/logo";
import { Button } from "./Button";
import { MoondevLogo } from "./MoondevLogo";

type LogoUploaderProps = {
  logo: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

export function LogoUploader({ logo, onSelect, onRemove }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const takeFile = (file: File | undefined) => {
    if (!file) return;
    onSelect(file);
  };

  const dragHandlers = {
    onDragEnter: (event: DragEvent) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragOver: (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      setDragging(true);
    },
    onDragLeave: (event: DragEvent) => {
      if (event.currentTarget.contains(event.relatedTarget as Node)) return;
      setDragging(false);
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      setDragging(false);
      takeFile(event.dataTransfer.files[0]);
    },
  };

  const zoneClass = dragging
    ? "border-accent bg-accent/20"
    : "border-line bg-field";

  return (
    <div className="flex flex-col gap-1.5">
      <span id="logo-label" className="text-[13px] font-medium text-ink">
        Logo
      </span>
      <input
        ref={inputRef}
        id="business-logo"
        type="file"
        accept="image/*"
        className="sr-only"
        aria-labelledby="logo-label"
        onChange={(event) => {
          takeFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {logo ? (
        <div
          {...dragHandlers}
          className={`flex items-center gap-4 rounded-[2px] border border-dashed px-4 py-4 transition-colors ${zoneClass}`}
        >
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[2px] border border-line bg-white">
            <div className="flex h-full w-full items-center justify-center p-2">
              {isMoondevWordmark(logo) ? (
                <MoondevLogo className="text-[13px]" />
              ) : (
                <img
                  src={logo}
                  alt="Business logo"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <button
              type="button"
              aria-label="Remove logo"
              onClick={onRemove}
              className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-[2px] bg-white text-danger shadow-sm ring-1 ring-line hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">
              {dragging ? "Drop to replace" : "Logo added"}
            </p>
            <p className="mt-1 text-xs leading-snug text-ink-muted">
              Drop a new image here, or replace the current file.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                className="h-9"
                onClick={() => inputRef.current?.click()}
              >
                Replace
              </Button>
              <Button variant="danger" className="h-9 px-3" onClick={onRemove}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor="business-logo"
          {...dragHandlers}
          className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-[2px] border border-dashed px-6 py-8 text-center transition-colors ${zoneClass}`}
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-[2px] border ${
              dragging
                ? "border-ink bg-white text-ink"
                : "border-line bg-white text-ink-muted"
            }`}
          >
            <ImageIcon />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink">
              {dragging ? "Drop image to upload" : "Drop logo here"}
            </span>
            <span className="text-xs leading-snug text-ink-muted">
              or click to browse · PNG, JPG, or SVG · max 1.5 MB
            </span>
          </span>
        </label>
      )}
    </div>
  );
}

function ImageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="17" height="13" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 14.5l4.5-4.5 3.5 3.5 3-3 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="bevel"
      />
      <circle cx="8" cy="8.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3 3l6 6M9 3L3 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
