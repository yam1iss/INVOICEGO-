import type { ReactNode } from "react";
import { DOCUMENT_TYPES, getDocumentConfig } from "../data/documentTypes";
import type { InvoiceController } from "../hooks/useInvoice";
import { BusinessForm } from "./BusinessForm";
import { ClientForm } from "./ClientForm";
import { DepositPayment } from "./DepositPayment";
import { InvoiceDetails } from "./InvoiceDetails";
import { ItemsEditor } from "./ItemsEditor";
import { NotesForm } from "./NotesForm";

type InvoiceEditorProps = {
  state: InvoiceController;
};

export function InvoiceEditor({ state }: InvoiceEditorProps) {
  const { invoice } = state;
  const docConfig = getDocumentConfig(invoice.documentType);
  const selectedType = invoice.documentType ?? "invoice";

  return (
    <aside
      data-print-hide
      className="print:hidden h-full min-h-0 w-full min-w-0 overflow-y-auto border-b border-line bg-paper lg:border-b-0 lg:border-r"
    >
      <div className="px-4 py-6 pb-10 sm:px-6 sm:py-8 md:px-8 lg:px-8 lg:py-10">
        <EditorSection title="Document type">
          <div className="grid grid-cols-3 gap-2">
            {DOCUMENT_TYPES.map((doc) => {
              const isSelected = selectedType === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => state.setDocumentType(doc.id)}
                  className={`flex h-11 items-center justify-center rounded-[3px] border px-2 py-2 text-center transition-all ${
                    isSelected
                      ? "border-accent bg-accent/15 text-ink shadow-[0_1px_2px_rgba(10,10,10,0.06)] ring-1 ring-accent/40 font-semibold"
                      : "border-line bg-field text-ink-muted hover:border-line-strong hover:bg-paper hover:text-ink"
                  }`}
                >
                  <span className="text-[12px] sm:text-[13px] leading-tight font-medium">
                    {doc.label}
                  </span>
                </button>
              );
            })}
          </div>
        </EditorSection>

        <EditorSection title="Business">
          <BusinessForm
            business={invoice.business}
            lineTheme={invoice.lineTheme ?? "split"}
            onChange={state.updateBusiness}
            onLogoSelect={state.setLogo}
            onLogoRemove={state.removeLogo}
            onLineThemeChange={state.setLineTheme}
          />
        </EditorSection>

        <EditorSection title={docConfig.recipientLabel}>
          <ClientForm
            documentType={invoice.documentType}
            client={invoice.client}
            onChange={state.updateClient}
          />
        </EditorSection>

        <EditorSection title="Document details">
          <InvoiceDetails
            details={invoice.details}
            documentType={invoice.documentType ?? "invoice"}
            onChange={state.updateDetails}
          />
        </EditorSection>

        <EditorSection title="Items">
          <ItemsEditor
            items={invoice.items}
            currency={invoice.details.currency}
            focusItemId={state.focusItemId}
            onChangeItem={state.updateItem}
            onAddItem={state.addItem}
            onRemoveItem={state.removeItem}
            onItemFocused={state.clearItemFocus}
          />
        </EditorSection>

        <EditorSection
          title={
            invoice.documentType === "quotation"
              ? "Taxes & Discounts"
              : invoice.documentType === "delivery_order"
                ? "Taxes & Adjustments"
                : "Deposit & Payment"
          }
        >
          <DepositPayment
            documentType={invoice.documentType}
            taxRate={invoice.taxRate}
            discount={invoice.discount}
            deposit={invoice.deposit ?? 0}
            currency={invoice.details.currency}
            onTaxRateChange={state.setTaxRate}
            onDiscountChange={state.setDiscount}
            onDepositChange={state.setDeposit}
          />
        </EditorSection>

        <EditorSection title="Additional notes & terms">
          <NotesForm
            documentType={invoice.documentType}
            notes={invoice.notes}
            paymentTerms={invoice.paymentTerms}
            onNotesChange={state.setNotes}
            onPaymentTermsChange={state.setPaymentTerms}
          />
        </EditorSection>
      </div>
    </aside>
  );
}

function EditorSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 border-b border-line pb-8 last:mb-0 last:border-b-0 last:pb-0">
      <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}
