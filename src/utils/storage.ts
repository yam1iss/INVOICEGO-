import type { DocumentType } from "../data/documentTypes";
import { migrateLineTheme } from "../data/lineThemes";
import { createDefaultInvoice } from "../data/defaults";
import { MOONDEV_WORDMARK } from "../data/logo";
import type { Invoice } from "../types/invoice";
import {
  clampPercent,
  moneyDiscountToPercent,
} from "./calculations";

export const STORAGE_KEY = "invoice:draft:v3";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asLogo(value: unknown): string | null {
  if (value === null) return null;
  if (typeof value !== "string") return null;
  if (value === MOONDEV_WORDMARK) return value;
  if (value.startsWith("data:image/")) return value;
  if (
    (value.startsWith("/") || value.startsWith("./")) &&
    /\.(png|jpe?g|gif|webp|svg)$/i.test(value)
  ) {
    return value;
  }
  return null;
}

export function loadInvoice(): Invoice {
  const defaults = createDefaultInvoice();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return defaults;
    return normalizeInvoice(parsed, defaults);
  } catch {
    return defaults;
  }
}

export function saveInvoice(invoice: Invoice): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
  } catch {
    // Quota or private mode — editing still works in memory.
  }
}

export function clearInvoice(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

function normalizeInvoice(
  parsed: Record<string, unknown>,
  fallback: Invoice,
): Invoice {
  const business = isRecord(parsed.business) ? parsed.business : {};
  const client = isRecord(parsed.client) ? parsed.client : {};
  const details = isRecord(parsed.details) ? parsed.details : {};
  const items = Array.isArray(parsed.items)
    ? parsed.items.filter(isRecord).map((item, index) => {
        const quantity = asNumber(item.quantity, 0);
        const rate = asNumber(item.rate, 0);
        const rawDiscount = asNumber(item.discount, 0);
        const alreadyPercent = parsed.itemDiscountUnit === "percent";
        return {
          id: asString(item.id, `item-${index}`),
          description: asString(item.description, ""),
          quantity,
          rate,
          discount: alreadyPercent
            ? clampPercent(rawDiscount)
            : moneyDiscountToPercent(quantity, rate, rawDiscount),
        };
      })
    : fallback.items;

  const currency = asString(
    details.currency,
    fallback.details.currency,
  ) as Invoice["details"]["currency"];

  const docType = (typeof parsed.documentType === "string" &&
    ["invoice", "quotation", "delivery_order"].includes(parsed.documentType)
    ? parsed.documentType
    : fallback.documentType ?? "invoice") as DocumentType;

  return {
    documentType: docType,
    business: {
      name: asString(business.name, fallback.business.name),
      email: asString(business.email, fallback.business.email),
      phone: asString(business.phone, fallback.business.phone),
      address: asString(business.address, fallback.business.address),
      website: asString(business.website, fallback.business.website),
      logo: asLogo(business.logo) ?? (business.logo === null ? null : fallback.business.logo),
    },
    client: {
      name: asString(client.name, fallback.client.name),
      email: asString(client.email, fallback.client.email),
      phone: asString(client.phone, fallback.client.phone),
      address: asString(client.address, fallback.client.address),
    },
    details: {
      invoiceNumber: asString(
        details.invoiceNumber,
        fallback.details.invoiceNumber,
      ),
      issueDate: asString(details.issueDate, fallback.details.issueDate),
      dueDate: asString(details.dueDate, fallback.details.dueDate),
      currency: isAllowedCurrency(currency)
        ? currency
        : fallback.details.currency,
    },
    items: items.length > 0 ? items : fallback.items,
    taxRate: asNumber(parsed.taxRate, fallback.taxRate),
    discount: asNumber(parsed.discount, fallback.discount),
    deposit: asNumber(parsed.deposit, fallback.deposit ?? 0),
    itemDiscountUnit: "percent",
    notes: asString(parsed.notes, fallback.notes),
    paymentTerms: asString(parsed.paymentTerms, fallback.paymentTerms),
    ...normalizeLineRule(parsed, fallback),
  };
}

function normalizeLineRule(
  parsed: Record<string, unknown>,
  fallback: Invoice,
): Pick<Invoice, "lineTheme" | "lineColor"> {
  const migrated =
    typeof parsed.lineTheme === "string"
      ? migrateLineTheme(parsed.lineTheme)
      : {};

  return {
    lineTheme: migrated.theme ?? fallback.lineTheme,
    lineColor: "gold",
  };
}

function isAllowedCurrency(
  value: string,
): value is Invoice["details"]["currency"] {
  return ["USD", "EUR", "GBP", "MYR", "SGD", "AUD", "CAD", "JPY"].includes(
    value,
  );
}
