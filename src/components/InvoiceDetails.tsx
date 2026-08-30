import { CURRENCIES } from "../data/currencies";
import { DOCUMENT_TYPES, getDocumentConfig, type DocumentType } from "../data/documentTypes";
import type { InvoiceDetails as InvoiceDetailsData } from "../types/invoice";
import { DatePicker } from "./DatePicker";
import { Dropdown } from "./Dropdown";
import { Field } from "./Field";
import { Input } from "./Input";

type InvoiceDetailsProps = {
  details: InvoiceDetailsData;
  documentType: DocumentType;
  onChange: (patch: Partial<InvoiceDetailsData>) => void;
  onDocumentTypeChange: (type: DocumentType) => void;
};

export function InvoiceDetails({
  details,
  documentType,
  onChange,
  onDocumentTypeChange,
}: InvoiceDetailsProps) {
  const docConfig = getDocumentConfig(documentType);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Document type" htmlFor="document-type">
          <Dropdown
            id="document-type"
            value={documentType}
            options={DOCUMENT_TYPES.map((doc) => ({
              value: doc.id,
              label: doc.label,
            }))}
            onChange={(value) => onDocumentTypeChange(value as DocumentType)}
          />
        </Field>
        <Field label={docConfig.numberLabel} htmlFor="invoice-number">
          <Input
            id="invoice-number"
            value={details.invoiceNumber}
            placeholder={docConfig.defaultNumber}
            onChange={(event) => onChange({ invoiceNumber: event.target.value })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <Field label={docConfig.primaryDateLabel} htmlFor="invoice-issue-date">
          <DatePicker
            id="invoice-issue-date"
            value={details.issueDate}
            onChange={(issueDate) => onChange({ issueDate })}
          />
        </Field>
        <Field label={docConfig.secondaryDateLabel} htmlFor="invoice-due-date">
          <DatePicker
            id="invoice-due-date"
            value={details.dueDate}
            onChange={(dueDate) => onChange({ dueDate })}
          />
        </Field>
      </div>
    </div>
  );
}
