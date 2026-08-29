import { CURRENCIES } from "../data/currencies";
import { PLACEHOLDERS } from "../data/placeholders";
import type { InvoiceDetails as InvoiceDetailsData } from "../types/invoice";
import { DatePicker } from "./DatePicker";
import { Dropdown } from "./Dropdown";
import { Field } from "./Field";
import { Input } from "./Input";

type InvoiceDetailsProps = {
  details: InvoiceDetailsData;
  onChange: (patch: Partial<InvoiceDetailsData>) => void;
};

export function InvoiceDetails({ details, onChange }: InvoiceDetailsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Invoice number" htmlFor="invoice-number">
        <Input
          id="invoice-number"
          value={details.invoiceNumber}
          placeholder={PLACEHOLDERS.invoiceNumber}
          onChange={(event) => onChange({ invoiceNumber: event.target.value })}
        />
      </Field>
      <Field label="Currency" htmlFor="invoice-currency">
        <Dropdown
          id="invoice-currency"
          value={details.currency}
          options={CURRENCIES.map((currency) => ({
            value: currency.code,
            label: currency.label,
          }))}
          onChange={(currency) =>
            onChange({
              currency: currency as InvoiceDetailsData["currency"],
            })
          }
        />
      </Field>
      <Field label="Issue date" htmlFor="invoice-issue-date">
        <DatePicker
          id="invoice-issue-date"
          value={details.issueDate}
          onChange={(issueDate) => onChange({ issueDate })}
        />
      </Field>
      <Field label="Due date" htmlFor="invoice-due-date">
        <DatePicker
          id="invoice-due-date"
          value={details.dueDate}
          onChange={(dueDate) => onChange({ dueDate })}
        />
      </Field>
    </div>
  );
}
