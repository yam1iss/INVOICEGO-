import type { Invoice } from "../types/invoice";
import { toFinite } from "./calculations";

function hasText(value: string | null | undefined): boolean {
  return (value ?? "").trim().length > 0;
}

export function canDownloadInvoice(invoice: Invoice): boolean {
  const hasParty =
    hasText(invoice.business.name) || hasText(invoice.client.name);
  const hasItem = invoice.items.some(
    (item) =>
      hasText(item.description) ||
      toFinite(item.quantity) * toFinite(item.rate) > 0,
  );
  return hasParty && hasItem;
}
