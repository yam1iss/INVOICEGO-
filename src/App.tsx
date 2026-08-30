import { useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Header } from "./components/Header";
import { InvoiceEditor } from "./components/InvoiceEditor";
import { InvoicePreview } from "./components/InvoicePreview";
import { SiteFooter } from "./components/SiteFooter";
import { WorkspaceTabs } from "./components/WorkspaceTabs";
import { getDocumentConfig } from "./data/documentTypes";
import { useInvoice } from "./hooks/useInvoice";
import { canDownloadInvoice } from "./utils/invoiceReady";
import { downloadInvoicePdf } from "./utils/pdf";

export default function App() {
  const invoiceState = useInvoice();
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [downloading, setDownloading] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const canDownload = canDownloadInvoice(invoiceState.invoice);
  const docConfig = getDocumentConfig(invoiceState.invoice.documentType);

  async function handleDownloadPdf() {
    if (downloading || !canDownload) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(
        invoiceState.invoice.details.invoiceNumber,
        invoiceState.invoice.documentType ?? "invoice",
      );
    } catch (error) {
      console.error("Could not download invoice PDF.", error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      data-app
      className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-desk"
    >
      <div
        data-print-hide
        className="print:hidden h-0.5 w-full shrink-0 bg-accent"
        aria-hidden="true"
      />
      <Header
        documentType={invoiceState.invoice.documentType ?? "invoice"}
        onDocumentTypeChange={invoiceState.setDocumentType}
        onNew={() => setConfirmNew(true)}
        onDownloadPdf={handleDownloadPdf}
        downloading={downloading}
        canDownload={canDownload}
      />
      <WorkspaceTabs view={view} onChange={setView} />
      <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div
          className={`min-h-0 min-w-0 flex-1 flex-col overflow-hidden print:hidden ${
            view === "edit" ? "flex" : "hidden"
          } lg:flex lg:w-[54%] lg:flex-none`}
        >
          <InvoiceEditor state={invoiceState} />
        </div>
        <div
          className={`min-h-0 min-w-0 flex-1 flex-col overflow-hidden print:flex ${
            view === "preview" ? "flex" : "hidden"
          } lg:flex lg:w-[46%] lg:flex-none`}
        >
          <InvoicePreview invoice={invoiceState.invoice} />
        </div>
      </main>
      <SiteFooter />
      <ConfirmDialog
        open={confirmNew}
        title={`Start a new ${docConfig.label.toLowerCase()}?`}
        description="The current draft will be cleared."
        confirmLabel="Start new"
        onCancel={() => setConfirmNew(false)}
        onConfirm={() => {
          invoiceState.reset(invoiceState.invoice.documentType);
          setConfirmNew(false);
        }}
      />
    </div>
  );
}
