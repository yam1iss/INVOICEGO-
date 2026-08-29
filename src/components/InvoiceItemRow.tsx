import { PLACEHOLDERS } from "../data/placeholders";
import type { CurrencyCode, InvoiceItem } from "../types/invoice";
import { clampPercent, lineAmount } from "../utils/calculations";
import { currencyLabel, formatAmount } from "../utils/format";
import { Button } from "./Button";
import { Input } from "./Input";
import { NumberInput } from "./NumberInput";

type InvoiceItemRowProps = {
  item: InvoiceItem;
  currency: CurrencyCode;
  autoFocus: boolean;
  onChange: (patch: Partial<Omit<InvoiceItem, "id">>) => void;
  onRemove: () => void;
  onFocused: () => void;
};

export function InvoiceItemRow({
  item,
  currency,
  autoFocus,
  onChange,
  onRemove,
  onFocused,
}: InvoiceItemRowProps) {
  const amount = lineAmount(item.quantity, item.rate, item.discount ?? 0);

  return (
    <div className="grid grid-cols-12 gap-2 border-b border-line py-3 last:border-b-0">
      <div className="col-span-12 sm:col-span-3">
        <label className="mb-1 block text-[11px] font-medium text-ink-muted sm:sr-only">
          Description
        </label>
        <Input
          value={item.description}
          placeholder={PLACEHOLDERS.itemDescription}
          autoFocus={autoFocus}
          aria-label="Description"
          onFocus={onFocused}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <label className="mb-1 block text-[11px] font-medium text-ink-muted sm:sr-only">
          Qty
        </label>
        <NumberInput
          min={0}
          value={item.quantity}
          aria-label="Quantity"
          onValueChange={(quantity) =>
            onChange({ quantity: Math.max(0, quantity) })
          }
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <label className="mb-1 block text-[11px] font-medium text-ink-muted sm:sr-only">
          Rate ({currencyLabel(currency)})
        </label>
        <NumberInput
          min={0}
          value={item.rate}
          aria-label="Unit price"
          onValueChange={(rate) => onChange({ rate: Math.max(0, rate) })}
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <label className="mb-1 block text-[11px] font-medium text-ink-muted sm:sr-only">
          Disc. (%)
        </label>
        <NumberInput
          min={0}
          max={100}
          value={item.discount ?? 0}
          aria-label="Item discount percent"
          onValueChange={(discount) =>
            onChange({ discount: clampPercent(discount) })
          }
        />
      </div>
      <div className="col-span-2 sm:col-span-2 flex flex-col">
        <span className="mb-1 text-[11px] font-medium text-ink-muted sm:sr-only">
          Amount ({currencyLabel(currency)})
        </span>
        <div className="flex h-10 items-center justify-end px-0.5 text-[11px] tabular-nums text-ink sm:px-1 sm:text-sm">
          {formatAmount(amount, currency)}
        </div>
      </div>
      <div className="col-span-1 flex items-end sm:items-center justify-end">
        <Button
          variant="danger"
          className="h-10 w-10 px-0"
          aria-label="Remove item"
          onClick={onRemove}
        >
          <RemoveIcon />
        </Button>
      </div>
    </div>
  );
}

function RemoveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l8 8M11 3l-8 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}
