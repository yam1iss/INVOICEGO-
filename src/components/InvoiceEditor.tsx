import type { ReactNode } from "react";
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

  return (
    <aside
      data-print-hide
      className="print:hidden h-full min-h-0 w-full min-w-0 overflow-y-auto border-b border-line bg-paper lg:border-b-0 lg:border-r"
    >
      <div className="px-4 py-6 pb-10 sm:px-6 sm:py-8 md:px-8 lg:px-8 lg:py-10">
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
        <EditorSection title="Client">
          <ClientForm
            client={invoice.client}
            onChange={state.updateClient}
          />
        </EditorSection>
        <EditorSection title="Invoice details">
          <InvoiceDetails
            details={invoice.details}
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
        <EditorSection title="Deposit & Payment">
          <DepositPayment
            taxRate={invoice.taxRate}
            discount={invoice.discount}
            deposit={invoice.deposit ?? 0}
            currency={invoice.details.currency}
            onTaxRateChange={state.setTaxRate}
            onDiscountChange={state.setDiscount}
            onDepositChange={state.setDeposit}
          />
        </EditorSection>
        <EditorSection title=" Additional Notes">
          <NotesForm
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
