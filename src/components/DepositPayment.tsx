import type { DocumentType } from "../data/documentTypes";
import type { CurrencyCode } from "../types/invoice";
import { currencyLabel } from "../utils/format";
import { Field } from "./Field";
import { NumberInput } from "./NumberInput";

type DepositPaymentProps = {
  documentType?: DocumentType;
  taxRate: number;
  discount: number;
  deposit: number;
  currency: CurrencyCode;
  onTaxRateChange: (value: number) => void;
  onDiscountChange: (value: number) => void;
  onDepositChange: (value: number) => void;
};

export function DepositPayment({
  documentType,
  taxRate,
  discount,
  deposit,
  currency,
  onTaxRateChange,
  onDiscountChange,
  onDepositChange,
}: DepositPaymentProps) {
  const discountHint =
    documentType === "quotation"
      ? "Quotation-wide amount, after per-item discounts."
      : "Invoice-wide amount, after per-item discounts.";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field
        label="Tax rate (%)"
        htmlFor="tax-rate"
        hint="Applied after line and overall discounts."
      >
        <NumberInput
          id="tax-rate"
          min={0}
          value={taxRate}
          onValueChange={onTaxRateChange}
        />
      </Field>
      <Field
        label={`Discount (${currencyLabel(currency)})`}
        htmlFor="discount"
        hint={discountHint}
      >
        <NumberInput
          id="discount"
          min={0}
          value={discount}
          onValueChange={onDiscountChange}
        />
      </Field>
      {documentType !== "delivery_order" ? (
        <Field
          label={`Deposit (${currencyLabel(currency)})`}
          htmlFor="deposit"
          hint="Amount already received. Subtracted from the total."
        >
          <NumberInput
            id="deposit"
            min={0}
            value={deposit}
            onValueChange={onDepositChange}
          />
        </Field>
      ) : null}
    </div>
  );
}
