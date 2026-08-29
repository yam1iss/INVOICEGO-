import type { Invoice } from "../types/invoice";

function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function createDefaultInvoice(now = new Date()): Invoice {
  const issue = isoDate(now);
  const due = isoDate(addDays(now, 14));

  return {
    business: {
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      logo: null,
    },
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    details: {
      invoiceNumber: "",
      issueDate: issue,
      dueDate: due,
      currency: "MYR",
    },
    items: [
      {
        id: "item-1",
        description: "",
        quantity: 1,
        rate: 0,
        discount: 0,
      },
    ],
    taxRate: 0,
    discount: 0,
    deposit: 0,
    itemDiscountUnit: "percent",
    notes: "",
    paymentTerms: "",
    lineTheme: "split",
    lineColor: "gold",
  };
}
