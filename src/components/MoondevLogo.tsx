type MoondevLogoProps = {
  className?: string;
};

export function MoondevLogo({ className = "" }: MoondevLogoProps) {
  return (
    <span
      className={`moondev-logo inline-flex items-baseline bg-transparent font-[family-name:var(--font-logo)] font-black uppercase leading-none tracking-[-0.08em] [print-color-adjust:exact] [-webkit-print-color-adjust:exact] ${className}`}
      aria-label="Moondev"
    >
      <span className="text-ink">MOON</span>
      <span className="text-accent">DEV.</span>
    </span>
  );
}
