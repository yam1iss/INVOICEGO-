export function toFinite(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function parseNumber(raw: string): number {
  if (raw.trim() === "") return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function roundMoney(value: number): number {
  return Math.round((toFinite(value) + Number.EPSILON) * 100) / 100;
}

export function lineGross(quantity: number, rate: number): number {
  return roundMoney(toFinite(quantity) * toFinite(rate));
}

export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, toFinite(value)));
}

export function lineDiscount(
  quantity: number,
  rate: number,
  discountPercent = 0,
): number {
  const gross = lineGross(quantity, rate);
  return roundMoney(gross * (clampPercent(discountPercent) / 100));
}

export function moneyDiscountToPercent(
  quantity: number,
  rate: number,
  money: number,
): number {
  const gross = lineGross(quantity, rate);
  if (gross <= 0) return 0;
  return roundMoney(
    clampPercent((Math.max(0, toFinite(money)) / gross) * 100),
  );
}

export function lineAmount(
  quantity: number,
  rate: number,
  discount = 0,
): number {
  return roundMoney(
    lineGross(quantity, rate) - lineDiscount(quantity, rate, discount),
  );
}

export type LineItem = {
  quantity: number;
  rate: number;
  discount?: number;
};

export function subtotal(items: ReadonlyArray<LineItem>): number {
  return roundMoney(
    items.reduce(
      (sum, item) =>
        sum + lineAmount(item.quantity, item.rate, item.discount ?? 0),
      0,
    ),
  );
}

export function itemDiscountTotal(items: ReadonlyArray<LineItem>): number {
  return roundMoney(
    items.reduce(
      (sum, item) =>
        sum + lineDiscount(item.quantity, item.rate, item.discount ?? 0),
      0,
    ),
  );
}

export function discountAmount(
  discount: number,
  subtotalValue: number,
): number {
  const amount = Math.max(0, toFinite(discount));
  return roundMoney(Math.min(amount, Math.max(0, subtotalValue)));
}

export function taxableAmount(
  subtotalValue: number,
  discount: number,
): number {
  return roundMoney(
    Math.max(0, subtotalValue - discountAmount(discount, subtotalValue)),
  );
}

export function taxAmount(
  subtotalValue: number,
  discount: number,
  taxRate: number,
): number {
  const rate = Math.max(0, toFinite(taxRate)) / 100;
  return roundMoney(taxableAmount(subtotalValue, discount) * rate);
}

export function total(
  subtotalValue: number,
  discount: number,
  taxRate: number,
): number {
  return roundMoney(
    taxableAmount(subtotalValue, discount) +
      taxAmount(subtotalValue, discount, taxRate),
  );
}

export function depositAmount(deposit: number, totalValue: number): number {
  const amount = Math.max(0, toFinite(deposit));
  return roundMoney(Math.min(amount, Math.max(0, totalValue)));
}

export type InvoiceTotals = {
  subtotal: number;
  itemDiscount: number;
  discount: number;
  tax: number;
  total: number;
  deposit: number;
  amountDue: number;
};

export function computeTotals(
  items: ReadonlyArray<LineItem>,
  discount: number,
  taxRate: number,
  deposit = 0,
): InvoiceTotals {
  const sub = subtotal(items);
  const itemDisc = itemDiscountTotal(items);
  const disc = discountAmount(discount, sub);
  const tax = taxAmount(sub, discount, taxRate);
  const tot = total(sub, discount, taxRate);
  const dep = depositAmount(deposit, tot);
  return {
    subtotal: sub,
    itemDiscount: itemDisc,
    discount: disc,
    tax,
    total: tot,
    deposit: dep,
    amountDue: roundMoney(tot - dep),
  };
}
