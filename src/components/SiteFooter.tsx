import { MoondevLogo } from "./MoondevLogo";

export function SiteFooter() {
  return (
    <footer
      data-print-hide
      className="print:hidden shrink-0 border-t border-line bg-paper px-4 py-2.5 sm:px-6 lg:px-8"
    >
      <p className="flex min-w-0 items-center justify-end gap-1.5 text-[11px] text-ink-muted">
        <span>Developed by</span>
        <a
          href="https://moon-devs.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[2px] hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-label="Moondev website"
        >
          <MoondevLogo className="text-[12px] sm:text-[13px]" />
        </a>
      </p>
    </footer>
  );
}
