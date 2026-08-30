import type { DocumentType } from "../data/documentTypes";
import { PLACEHOLDERS } from "../data/placeholders";
import type { ClientInfo } from "../types/invoice";
import { Field } from "./Field";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

type ClientFormProps = {
  documentType?: DocumentType;
  client: ClientInfo;
  onChange: (patch: Partial<ClientInfo>) => void;
};

export function ClientForm({ documentType, client, onChange }: ClientFormProps) {
  const nameLabel =
    documentType === "delivery_order"
      ? "Recipient name / Company"
      : "Client name";

  return (
    <div className="flex flex-col gap-4">
      <Field label={nameLabel} htmlFor="client-name">
        <Input
          id="client-name"
          value={client.name}
          placeholder={PLACEHOLDERS.clientName}
          autoComplete="off"
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="client-email">
          <Input
            id="client-email"
            type="email"
            value={client.email}
            placeholder={PLACEHOLDERS.clientEmail}
            autoComplete="off"
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </Field>
        <Field label="Phone" htmlFor="client-phone">
          <Input
            id="client-phone"
            type="tel"
            value={client.phone}
            placeholder={PLACEHOLDERS.clientPhone}
            autoComplete="off"
            onChange={(event) => onChange({ phone: event.target.value })}
          />
        </Field>
      </div>
      <Field label="Address" htmlFor="client-address">
        <Textarea
          id="client-address"
          value={client.address}
          placeholder={PLACEHOLDERS.clientAddress}
          rows={3}
          autoComplete="off"
          onChange={(event) => onChange({ address: event.target.value })}
        />
      </Field>
    </div>
  );
}
