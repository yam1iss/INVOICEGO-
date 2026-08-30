import { useRef, useState } from "react";
import { DOCUMENT_TYPES, getDocumentConfig, type DocumentType } from "../data/documentTypes";
import { useDismiss } from "../hooks/useDismiss";
import { Button } from "./Button";
import { InvoiceGoLogo } from "./InvoiceGoLogo";

type HeaderProps = {
  documentType: DocumentType;
  onDocumentTypeChange: (type: DocumentType) => void;
  onNew: () => void;
  onDownloadPdf: () => void;
  downloading?: boolean;
  canDownload?: boolean;
};

export function Header({
  documentType,
  onDocumentTypeChange,
  onNew,
  onDownloadPdf,
  downloading = false,
  canDownload = true,
}: HeaderProps) {
  const [docMenuOpen, setDocMenuOpen] = useState(false);
  const docMenuRef = useRef<HTMLDivElement>(null);
  useDismiss(docMenuOpen, () => setDocMenuOpen(false), [docMenuRef]);

  const activeDoc = getDocumentConfig(documentType);
  const downloadDisabled = downloading || !canDownload;

  return (
    <header
      data-print-hide
      className="print:hidden flex h-16 shrink-0 items-center justify-between gap-x-3 border-b border-line bg-paper px-4 sm:px-6 lg:px-8"
    >
      <div className="min-w-0">
        <InvoiceGoLogo className="text-[16px] min-[400px]:text-[18px] sm:text-[22px]" />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        {/* Document Type Selector Menu */}
        <div ref={docMenuRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={docMenuOpen}
            onClick={() => setDocMenuOpen((prev) => !prev)}
            className="inline-flex h-9 items-center gap-1.5 rounded-[2px] border border-line bg-paper px-2.5 text-xs font-semibold text-ink shadow-[0_1px_2px_rgba(10,10,10,0.04)] hover:border-line-strong hover:bg-field focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:h-10 sm:px-3 sm:text-sm"
          >
            <DocIcon />
            <span className="hidden sm:inline text-ink-muted font-normal">Type:</span>
            <span>{activeDoc.label}</span>
            <ChevronIcon open={docMenuOpen} />
          </button>

          {docMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 z-[80] mt-1.5 w-60 sm:w-64 overflow-hidden rounded-[4px] border border-line bg-white py-1 shadow-[0_12px_32px_rgba(10,10,10,0.14)]"
            >
              <div className="border-b border-line px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                Document Type
              </div>
              {DOCUMENT_TYPES.map((doc) => {
                const isSelected = doc.id === documentType;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    role="menuitem"
                    aria-selected={isSelected}
                    className={`flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-accent/15 text-ink font-semibold"
                        : "text-ink hover:bg-field"
                    }`}
                    onClick={() => {
                      onDocumentTypeChange(doc.id);
                      setDocMenuOpen(false);
                    }}
                  >
                    <span
                      className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                        isSelected ? "bg-accent" : "bg-transparent border border-line-strong"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] leading-tight font-medium text-ink">
                        {doc.label}
                      </span>
                      <span className="text-[11px] leading-normal text-ink-muted">
                        {doc.blurb}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <Button
          variant="secondary"
          className="h-9 px-2.5 text-xs sm:h-10 sm:px-3.5 sm:text-sm"
          onClick={onNew}
        >
          <span className="sm:hidden">New</span>
          <span className="hidden sm:inline">New {activeDoc.label.toLowerCase()}</span>
        </Button>

        <Button
          variant="primary"
          className="h-9 px-2.5 text-xs sm:h-10 sm:px-3.5 sm:text-sm"
          onClick={onDownloadPdf}
          disabled={downloadDisabled}
          aria-busy={downloading}
          title={
            canDownload
              ? undefined
              : "Add a business or client name and at least one item first."
          }
        >
          <span className="sm:hidden">{downloading ? "Saving…" : "PDF"}</span>
          <span className="hidden sm:inline">
            {downloading ? "Downloading…" : "Download PDF"}
          </span>
        </Button>
      </div>
    </header>
  );
}

function DocIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-ink-muted"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}
