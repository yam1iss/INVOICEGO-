export type DocumentType = "invoice" | "quotation" | "delivery_order";

export type DocumentTypeOption = {
  id: DocumentType;
  label: string;
  title: string;
  numberLabel: string;
  numberPrefix: string;
  defaultNumber: string;
  primaryDateLabel: string;
  secondaryDateLabel: string;
  recipientLabel: string;
  termsLabel: string;
  notesPlaceholder: string;
  termsPlaceholder: string;
  blurb: string;
};

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  {
    id: "invoice",
    label: "Invoice",
    title: "Invoice",
    numberLabel: "Invoice number",
    numberPrefix: "INV-",
    defaultNumber: "INV-0001",
    primaryDateLabel: "Issue date",
    secondaryDateLabel: "Due date",
    recipientLabel: "Bill to",
    termsLabel: "Payment terms",
    notesPlaceholder: "Thank you for your business.",
    termsPlaceholder: "Payment due within 14 days of the issue date.",
    blurb: "Bill clients for completed products and services.",
  },
  {
    id: "quotation",
    label: "Quotation",
    title: "Quotation",
    numberLabel: "Quotation number",
    numberPrefix: "QUO-",
    defaultNumber: "QUO-0001",
    primaryDateLabel: "Issue date",
    secondaryDateLabel: "Valid until",
    recipientLabel: "Quotation for",
    termsLabel: "Terms & Conditions",
    notesPlaceholder: "Thank you for the opportunity to quote.",
    termsPlaceholder: "Quotation valid for 30 days from the issue date.",
    blurb: "Provide estimated pricing to prospective clients.",
  },
  {
    id: "delivery_order",
    label: "Delivery Order",
    title: "Delivery Order",
    numberLabel: "DO number",
    numberPrefix: "DO-",
    defaultNumber: "DO-0001",
    primaryDateLabel: "Issue date",
    secondaryDateLabel: "Delivery date",
    recipientLabel: "Deliver to",
    termsLabel: "Acknowledgement",
    notesPlaceholder: "Goods received in good order and condition.",
    termsPlaceholder: "Received by: ____________________  Date: ___________",
    blurb: "Confirm shipment and proof of delivery for goods.",
  },
];

export function getDocumentConfig(type: DocumentType = "invoice"): DocumentTypeOption {
  return DOCUMENT_TYPES.find((doc) => doc.id === type) ?? DOCUMENT_TYPES[0];
}
