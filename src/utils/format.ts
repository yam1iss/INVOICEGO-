import type { CurrencyCode } from "../types/invoice";

const MONEY_LOCALE: Record<CurrencyCode, string> = {
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  MYR: "en-MY",
  SGD: "en-SG",
  AUD: "en-AU",
  CAD: "en-CA",
  JPY: "ja-JP",
};

export function currencyLabel(currency: CurrencyCode): string {
  return currency === "MYR" ? "RM" : currency;
}

export function formatAmount(amount: number, currency: CurrencyCode): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const code = MONEY_LOCALE[currency] ? currency : "USD";
  const isYen = code === "JPY";
  return new Intl.NumberFormat(MONEY_LOCALE[code], {
    minimumFractionDigits: isYen ? 0 : 2,
    maximumFractionDigits: isYen ? 0 : 2,
  }).format(safe);
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const label = currencyLabel(currency);
  const figure = formatAmount(amount, currency);
  return `${label} ${figure}`;
}

export function formatPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const rounded = Math.round((safe + Number.EPSILON) * 100) / 100;
  return `${rounded}%`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function createItemId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
