import { InvoiceGoMark } from "./InvoiceGoMark";

type InvoiceGoLogoProps = {
  className?: string;
  compact?: boolean;
};

export function InvoiceGoLogo({
  className = "",
  compact = false,
}: InvoiceGoLogoProps) {
  return (
    <span
      className="inline-flex min-w-0 items-center gap-0.5 sm:gap-1"
      aria-label="Invoice Go"
    >
      <InvoiceGoMark
        className={
          compact
            ? "h-5 w-[23px] shrink-0"
            : "h-10 w-[46px] shrink-0 sm:h-11 sm:w-[50px]"
        }
      />
      <span
        className={`min-w-0 truncate bg-transparent font-[family-name:var(--font-logo)] font-black uppercase leading-none tracking-[-0.08em] [print-color-adjust:exact] [-webkit-print-color-adjust:exact] ${className}`}
      >
        <span className="text-ink">Invoice</span>
        <span className="text-accent">{"\u202F"}Go!</span>
      </span>
    </span>
  );
}
