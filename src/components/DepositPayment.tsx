import type { CurrencyCode } from "../types/invoice";
import { currencyLabel } from "../utils/format";
import { Field } from "./Field";
import { NumberInput } from "./NumberInput";

type DepositPaymentProps = {
  taxRate: number;
  discount: number;
  deposit: number;
  currency: CurrencyCode;
  onTaxRateChange: (value: number) => void;
  onDiscountChange: (value: number) => void;
  onDepositChange: (value: number) => void;
};

export function DepositPayment({
  taxRate,
  discount,
  deposit,
  currency,
  onTaxRateChange,
  onDiscountChange,
  onDepositChange,
}: DepositPaymentProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field
        label="Tax rate (%)"
        htmlFor="tax-rate"
        hint="Applied after line and invoice discounts."
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
        hint="Invoice-wide amount, after any per-item discounts."
      >
        <NumberInput
          id="discount"
          min={0}
          value={discount}
          onValueChange={onDiscountChange}
        />
      </Field>
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
    </div>
  );
}
