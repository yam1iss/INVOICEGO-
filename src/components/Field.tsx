import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium leading-none text-ink"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs leading-snug text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}
