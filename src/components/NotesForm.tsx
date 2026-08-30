import type { DocumentType } from "../data/documentTypes";
import { getDocumentConfig } from "../data/documentTypes";
import { Field } from "./Field";
import { Textarea } from "./Textarea";

type NotesFormProps = {
  documentType?: DocumentType;
  notes: string;
  paymentTerms: string;
  onNotesChange: (value: string) => void;
  onPaymentTermsChange: (value: string) => void;
};

export function NotesForm({
  documentType,
  notes,
  paymentTerms,
  onNotesChange,
  onPaymentTermsChange,
}: NotesFormProps) {
  const docConfig = getDocumentConfig(documentType);
  const isDeliveryOrder = documentType === "delivery_order";

  return (
    <div className="flex flex-col gap-4">
      <Field label="Notes" htmlFor="notes">
        <Textarea
          id="notes"
          value={notes}
          placeholder={docConfig.notesPlaceholder}
          rows={3}
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </Field>
      {!isDeliveryOrder ? (
        <Field label={docConfig.termsLabel} htmlFor="payment-terms">
          <Textarea
            id="payment-terms"
            value={paymentTerms}
            placeholder={docConfig.termsPlaceholder}
            rows={3}
            onChange={(event) => onPaymentTermsChange(event.target.value)}
          />
        </Field>
      ) : null}
    </div>
  );
}
