import type { DocumentType } from "../data/documentTypes";
import type { LineColor, LineTheme } from "../data/lineThemes";

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "MYR"
  | "SGD"
  | "AUD"
  | "CAD"
  | "JPY";

export type BusinessInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo: string | null;
};

export type ClientInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type InvoiceDetails = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: CurrencyCode;
};

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  /** Per-line discount as a percent (0–100). */
  discount: number;
};

export type Invoice = {
  documentType?: DocumentType;
  business: BusinessInfo;
  client: ClientInfo;
  details: InvoiceDetails;
  items: InvoiceItem[];
  taxRate: number;
  /** Invoice-wide discount as money in the invoice currency. */
  discount: number;
  deposit: number;
  /** Line-item discounts are stored as percents after this flag is set. */
  itemDiscountUnit: "percent";
  notes: string;
  paymentTerms: string;
  lineTheme: LineTheme;
  lineColor: LineColor;
};
