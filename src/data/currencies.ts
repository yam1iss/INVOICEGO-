import type { CurrencyCode } from "../types/invoice";

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
};

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "MYR", label: "RM — Malaysian Ringgit" },
  { code: "SGD", label: "SGD — Singapore Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "JPY", label: "JPY — Japanese Yen" },
];
