import { PLACEHOLDERS } from "../data/placeholders";
import { Field } from "./Field";
import { Textarea } from "./Textarea";

type NotesFormProps = {
  notes: string;
  paymentTerms: string;
  onNotesChange: (value: string) => void;
  onPaymentTermsChange: (value: string) => void;
};

export function NotesForm({
  notes,
  paymentTerms,
  onNotesChange,
  onPaymentTermsChange,
}: NotesFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Notes" htmlFor="notes">
        <Textarea
          id="notes"
          value={notes}
          placeholder={PLACEHOLDERS.notes}
          rows={3}
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </Field>
      <Field label="Payment terms" htmlFor="payment-terms">
        <Textarea
          id="payment-terms"
          value={paymentTerms}
          placeholder={PLACEHOLDERS.paymentTerms}
          rows={3}
          onChange={(event) => onPaymentTermsChange(event.target.value)}
        />
      </Field>
    </div>
  );
}
