import { getDocumentConfig, type DocumentType } from "../data/documentTypes";
import { Button } from "./Button";
import { InvoiceGoLogo } from "./InvoiceGoLogo";

type HeaderProps = {
  documentType: DocumentType;
  onNew: () => void;
  onDownloadPdf: () => void;
  downloading?: boolean;
  canDownload?: boolean;
};

export function Header({
  documentType,
  onNew,
  onDownloadPdf,
  downloading = false,
  canDownload = true,
}: HeaderProps) {
  const activeDoc = getDocumentConfig(documentType);
  const downloadDisabled = downloading || !canDownload;

  return (
    <header
      data-print-hide
      className="print:hidden flex h-16 shrink-0 items-center justify-between gap-x-3 border-b border-line bg-paper px-4 sm:px-6 lg:px-8"
    >
      <div className="min-w-0">
        <InvoiceGoLogo className="text-[18px] sm:text-[22px]" />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
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
