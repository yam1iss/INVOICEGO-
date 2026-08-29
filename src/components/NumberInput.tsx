import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { Input } from "./Input";

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value: number;
  onValueChange: (value: number) => void;
};

const ALLOWED = /^-?\d*\.?\d*$/;

export function NumberInput({
  value,
  onValueChange,
  onBlur,
  onFocus,
  ...props
}: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? formatDisplay(value);

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={display}
      onFocus={(event) => {
        setDraft(formatDisplay(value));
        onFocus?.(event);
      }}
      onChange={(event) => {
        const raw = event.target.value;
        if (raw !== "" && !ALLOWED.test(raw)) return;
        setDraft(raw);
        onValueChange(parseDraft(raw));
      }}
      onBlur={(event) => {
        setDraft(null);
        onBlur?.(event);
      }}
      {...props}
    />
  );
}

function formatDisplay(value: number): string {
  if (!Number.isFinite(value)) return "";
  return String(value);
}

function parseDraft(raw: string): number {
  if (raw === "" || raw === "." || raw === "-" || raw === "-.") return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}
