import type { DocumentType } from "../data/documentTypes";
import type { CurrencyCode } from "../types/invoice";
import type { InvoiceTotals as Totals } from "../utils/calculations";
import { formatMoney, formatPercent } from "../utils/format";

type InvoiceTotalsProps = {
  documentType?: DocumentType;
  totals: Totals;
  taxRate: number;
  currency: CurrencyCode;
  showDiscount: boolean;
  showDeposit: boolean;
};

export function InvoiceTotals({
  documentType,
  totals,
  taxRate,
  currency,
  showDiscount,
  showDeposit,
}: InvoiceTotalsProps) {
  const taxLabel =
    taxRate > 0 ? `Tax (${formatPercent(taxRate)})` : "Tax";
  const dueLabel =
    showDeposit && documentType !== "quotation"
      ? "Amount due"
      : documentType === "quotation"
        ? "Quotation total"
        : "Total";
  const dueValue = showDeposit ? totals.amountDue : totals.total;

  return (
    <div
      data-invoice-totals
      className="ml-auto w-full max-w-none sm:max-w-[20rem]"
    >
      <TotalRow
        label="Subtotal"
        value={formatMoney(totals.subtotal, currency)}
      />
      {showDiscount ? (
        <TotalRow
          label="Discount"
          value={formatMoney(-totals.discount, currency)}
        />
      ) : null}
      <TotalRow
        label={taxLabel}
        value={formatMoney(totals.tax, currency)}
      />
      {showDeposit ? (
        <>
          <TotalRow
            label="Total"
            value={formatMoney(totals.total, currency)}
          />
          <TotalRow
            label="Deposit"
            value={formatMoney(-totals.deposit, currency)}
          />
        </>
      ) : null}
      <div className="mt-2 flex items-baseline justify-between gap-6 border-t border-ink pt-2.5">
        <span className="text-[12px] font-semibold text-ink">{dueLabel}</span>
        <span className="text-[13px] font-semibold tabular-nums text-ink">
          {formatMoney(dueValue, currency)}
        </span>
      </div>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-1.5">
      <span className="text-[12px] text-ink-muted">{label}</span>
      <span className="text-[13px] tabular-nums text-ink">{value}</span>
    </div>
  );
}
