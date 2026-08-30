import { getDocumentConfig } from "../data/documentTypes";
import { isMoondevWordmark } from "../data/logo";
import { PLACEHOLDERS } from "../data/placeholders";
import type { Invoice } from "../types/invoice";
import { computeTotals, lineAmount, lineDiscount } from "../utils/calculations";
import {
  currencyLabel,
  formatAmount,
  formatDate,
  formatPercent,
} from "../utils/format";
import { InvoiceGoLogo } from "./InvoiceGoLogo";
import { InvoiceRule } from "./InvoiceRule";
import { InvoiceTotals } from "./InvoiceTotals";
import { MoondevLogo } from "./MoondevLogo";

type InvoicePreviewProps = {
  invoice: Invoice;
};

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const { business, client, details, items } = invoice;
  const docConfig = getDocumentConfig(invoice.documentType);
  const totals = computeTotals(
    items,
    invoice.discount,
    invoice.taxRate,
    invoice.deposit ?? 0,
  );
  const notes = (invoice.notes ?? "").trim();
  const terms = (invoice.paymentTerms ?? "").trim();
  const hasItemDiscount = items.some(
    (item) => lineDiscount(item.quantity, item.rate, item.discount ?? 0) > 0,
  );
  const previewItems =
    items.length > 0
      ? items
      : [
          {
            id: "placeholder-item",
            description: "",
            quantity: 1,
            rate: 0,
            discount: 0,
          },
        ];

  return (
    <section
      data-print-root
      className="flex h-full min-h-0 min-w-0 flex-1 justify-center overflow-y-auto bg-desk px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10"
    >
      <article
        data-invoice-sheet
        className="flex h-fit w-full min-w-0 max-w-[794px] flex-col border border-line bg-[#FFFDF6] px-4 pb-5 pt-6 shadow-[0_10px_30px_rgba(28,27,25,0.08)] sm:px-8 sm:pb-6 sm:pt-10 md:px-12 md:pb-7 md:pt-12"
      >
        <InvoiceRule theme={invoice.lineTheme ?? "split"} />

        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col items-start gap-3">
            {isMoondevWordmark(business.logo) ? (
              <MoondevLogo className="max-w-full text-[22px] sm:text-[32px]" />
            ) : business.logo ? (
              <img
                src={business.logo}
                alt=""
                className="h-12 w-auto max-w-[14rem] object-contain sm:h-14"
              />
            ) : null}
            <div className="min-w-0">
              {!isMoondevWordmark(business.logo) ? (
                <p className="text-lg font-semibold tracking-tight sm:text-xl">
                  <PreviewText
                    value={business.name}
                    placeholder={PLACEHOLDERS.businessName}
                    filledClass="text-ink"
                  />
                </p>
              ) : null}
              <div
                className={`space-y-0.5 text-[12px] leading-relaxed ${isMoondevWordmark(business.logo) ? "" : "mt-2"}`}
              >
                <p>
                  <PreviewText
                    value={business.email}
                    placeholder={PLACEHOLDERS.businessEmail}
                  />
                </p>
                <p>
                  <PreviewText
                    value={business.phone}
                    placeholder={PLACEHOLDERS.businessPhone}
                  />
                </p>
                <p className="whitespace-pre-line">
                  <PreviewText
                    value={business.address}
                    placeholder={PLACEHOLDERS.businessAddress}
                  />
                </p>
                <p>
                  <PreviewText
                    value={business.website}
                    placeholder={PLACEHOLDERS.businessWebsite}
                  />
                </p>
              </div>
            </div>
          </div>
        </header>

        <div
          data-invoice-title
          className="mt-6 flex flex-row items-end justify-between gap-3 border-t border-line pt-6 sm:mt-8 sm:gap-6 sm:pt-8"
        >
          <h2 className="text-[17px] font-semibold uppercase tracking-[0.1em] text-ink min-[380px]:text-[20px] min-[440px]:text-[22px] sm:text-[28px] sm:tracking-[0.18em]">
            {docConfig.title}
          </h2>
          <dl className="grid shrink-0 grid-cols-[auto_auto] gap-x-2.5 gap-y-1 text-[11px] sm:gap-x-6 sm:gap-y-1.5 sm:text-[12px]">
            <Meta
              label={docConfig.numberLabel}
              value={details.invoiceNumber}
              placeholder={docConfig.defaultNumber}
            />
            <Meta label={docConfig.primaryDateLabel} value={formatDate(details.issueDate)} />
            <Meta label={docConfig.secondaryDateLabel} value={formatDate(details.dueDate)} />
          </dl>
        </div>

        <section className="mt-10">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {docConfig.recipientLabel}
          </h3>
          <p className="mt-2 text-[13px] font-semibold">
            <PreviewText
              value={client.name}
              placeholder={PLACEHOLDERS.clientName}
              filledClass="text-ink"
            />
          </p>
          <div className="mt-1 space-y-0.5 text-[12px] leading-relaxed">
            <p>
              <PreviewText
                value={client.email}
                placeholder={PLACEHOLDERS.clientEmail}
              />
            </p>
            <p>
              <PreviewText
                value={client.phone}
                placeholder={PLACEHOLDERS.clientPhone}
              />
            </p>
            <p className="whitespace-pre-line">
              <PreviewText
                value={client.address}
                placeholder={PLACEHOLDERS.clientAddress}
              />
            </p>
          </div>
        </section>

        <table className="mt-8 w-full table-fixed border-collapse text-left sm:mt-10">
          <thead>
            <tr className="border-b border-line-strong">
              <th className="pb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Description
              </th>
              <th className="w-12 pb-2 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted sm:w-14">
                Qty
              </th>
              <th className="w-[4.75rem] pb-2 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted sm:w-28">
                Rate({currencyLabel(details.currency)})
              </th>
              {hasItemDiscount ? (
                <th className="w-[4.5rem] pb-2 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted sm:w-24">
                  Disc. (%)
                </th>
              ) : null}
              <th className="w-[5.25rem] pb-2 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted sm:w-32">
                Amount({currencyLabel(details.currency)})
              </th>
            </tr>
          </thead>
          <tbody>
            {previewItems.map((item) => {
              const disc = lineDiscount(
                item.quantity,
                item.rate,
                item.discount ?? 0,
              );
              return (
              <tr key={item.id} className="border-b border-line">
                <td className="py-3 pr-2 align-top text-[12px] sm:pr-3 sm:text-[13px]">
                  <PreviewText
                    value={item.description}
                    placeholder={PLACEHOLDERS.itemDescription}
                    filledClass="text-ink"
                  />
                </td>
                <td className="py-3 align-top text-right text-[12px] tabular-nums text-ink sm:text-[13px]">
                  {formatQuantity(item.quantity)}
                </td>
                <td className="py-3 align-top text-right text-[12px] tabular-nums text-ink sm:text-[13px]">
                  {formatAmount(item.rate, details.currency)}
                </td>
                {hasItemDiscount ? (
                  <td className="py-3 align-top text-right text-[12px] tabular-nums text-ink sm:text-[13px]">
                    {disc > 0
                      ? formatPercent(item.discount ?? 0)
                      : "—"}
                  </td>
                ) : null}
                <td className="py-3 align-top text-right text-[12px] tabular-nums text-ink sm:text-[13px]">
                  {formatAmount(
                    lineAmount(item.quantity, item.rate, item.discount ?? 0),
                    details.currency,
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end print:break-inside-avoid">
          <InvoiceTotals
            documentType={invoice.documentType}
            totals={totals}
            taxRate={invoice.taxRate}
            currency={details.currency}
            showDiscount={totals.discount > 0}
            showDeposit={totals.deposit > 0}
          />
        </div>

        <footer className="mt-12 space-y-6 border-t border-line pt-6">
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Notes
            </h3>
            <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed">
              <PreviewText value={notes} placeholder={docConfig.notesPlaceholder} />
            </p>
          </div>

          {invoice.documentType === "delivery_order" ? (
            <div className="pt-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Acknowledgement
              </h3>
              <div className="mt-8 flex items-end justify-between gap-8 text-[12px]">
                <div className="w-56 max-w-[55%]">
                  <div className="mb-1.5 h-6 border-b border-ink/40" />
                  <p className="text-[11px] text-ink-muted">Received by / Signature & Chop</p>
                </div>
                <div className="w-36 text-right sm:w-44">
                  <div className="mb-1.5 h-6 border-b border-ink/40" />
                  <p className="text-[11px] text-ink-muted">Date</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {docConfig.termsLabel}
              </h3>
              <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed">
                <PreviewText
                  value={terms}
                  placeholder={docConfig.termsPlaceholder}
                />
              </p>
            </div>
          )}
        </footer>

        <p className="mt-auto flex items-center justify-end gap-1.5 pt-6 text-[10px] text-ink-muted">
          <span>Made with</span>
          <InvoiceGoLogo compact className="text-[10px] sm:text-[11px]" />
        </p>
      </article>
    </section>
  );
}

function PreviewText({
  value,
  placeholder,
  filledClass = "text-ink-muted",
}: {
  value: string;
  placeholder: string;
  filledClass?: string;
}) {
  const text = value.trim();
  return (
    <span className={text ? filledClass : "text-ink-muted/55"}>
      {text || placeholder}
    </span>
  );
}

function Meta({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder?: string;
}) {
  const filled = value.trim();
  const isEmpty = !filled || filled === "—";
  return (
    <>
      <dt className="text-ink-muted">{label}</dt>
      <dd
        className={`font-semibold tracking-tight text-right ${
          isEmpty && placeholder ? "text-ink-muted/55" : "text-ink"
        }`}
      >
        {isEmpty && placeholder ? placeholder : filled || "—"}
      </dd>
    </>
  );
}

function formatQuantity(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(safe);
}
