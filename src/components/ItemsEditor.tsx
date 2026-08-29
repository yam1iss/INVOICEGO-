import type { CurrencyCode, InvoiceItem } from "../types/invoice";
import { currencyLabel } from "../utils/format";
import { Button } from "./Button";
import { InvoiceItemRow } from "./InvoiceItemRow";

type ItemsEditorProps = {
  items: InvoiceItem[];
  currency: CurrencyCode;
  focusItemId: string | null;
  onChangeItem: (id: string, patch: Partial<Omit<InvoiceItem, "id">>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onItemFocused: () => void;
};

export function ItemsEditor({
  items,
  currency,
  focusItemId,
  onChangeItem,
  onAddItem,
  onRemoveItem,
  onItemFocused,
}: ItemsEditorProps) {
  return (
    <div>
      <div className="mb-1 hidden grid-cols-12 gap-2 px-0 sm:grid">
        <div className="col-span-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
          Description
        </div>
        <div className="col-span-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
          Qty
        </div>
        <div className="col-span-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
          Rate ({currencyLabel(currency)})
        </div>
        <div className="col-span-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
          Disc. (%)
        </div>
        <div className="col-span-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
          Amount ({currencyLabel(currency)})
        </div>
        <div className="col-span-1" />
      </div>
      <div className="border-t border-line">
        {items.length === 0 ? (
          <p className="py-6 text-sm text-ink-muted">
            No items yet. Add a line for each product or service.
          </p>
        ) : (
          items.map((item) => (
            <InvoiceItemRow
              key={item.id}
              item={item}
              currency={currency}
              autoFocus={focusItemId === item.id}
              onChange={(patch) => onChangeItem(item.id, patch)}
              onRemove={() => onRemoveItem(item.id)}
              onFocused={onItemFocused}
            />
          ))
        )}
      </div>
      <div className="pt-3">
        <Button variant="secondary" className="h-9" onClick={onAddItem}>
          Add item
        </Button>
      </div>
    </div>
  );
}
