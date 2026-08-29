# Invoice — Design & Implementation Rulebook

This file is the source of truth for the Invoice product. Every layout, component, copy choice, and calculation must follow these rules. If a change conflicts with this document, update the product to match the rulebook — do not invent a parallel visual language.

---

## 1. Product purpose

Invoice is a **browser-only invoice editor**. A person opens the page, fills in business, client, and line-item details, and sees a finished invoice on the right. They can print that document. Nothing is stored on a server.

The product is a **document tool**, not a SaaS dashboard, not a marketing site, and not an accounting platform.

What it does:

- Compose one professional invoice
- Preview it live as an A4-style document
- Recalculate totals as numbers change
- Print only the invoice sheet
- Optionally remember the current draft in `localStorage`

What it does not do:

- Accounts, login, or multi-user workflows
- Invoice history, status tracking, or “paid / overdue” dashboards
- Charts, revenue stats, or fake activity
- Sending email, generating PDFs on a server, or calling APIs

The primary job of the interface is: **make it obvious how to write an invoice, and make the result look like a real document.**

---

## 2. Design direction

The interface should feel like a **quiet professional document editor** — closer to a typeset invoice on a desk than to a startup admin panel.

Design principles:

- **Editorial, not decorative.** Hierarchy comes from type, spacing, and a few hairline borders.
- **Paper first.** The invoice preview is the hero. The editor exists to serve it.
- **Restrained.** One accent color. Neutral surfaces. No visual noise.
- **Workmanlike.** Labels, fields, and totals should be immediately scannable.
- **Honest.** Empty fields look empty. Sample data is clearly editable, not theatrical.

Visual references (intent, not imitation):

- A printed A4 invoice on cream/gray desk surface
- Traditional letterhead: logo, name, contact, then the word INVOICE
- Accounting software from the last decade that still respects paper — not a 2024 AI landing page

Mood: calm, precise, slightly warm. Not cold-blue SaaS. Not trendy-dark. Not playful.

---

## 3. Layout rules

### Page

- Full-height app shell. No marketing hero. No footer testimonials.
- Header is a thin work bar. Content below is editor + preview.
- Background is a soft warm-neutral “desk.” The invoice sits on it as a white sheet.

### Desktop (default)

- Two columns, side by side, filling remaining viewport height.
- **Editor ≈ 40%** of the content width. Scrolls independently if needed.
- **Preview ≈ 60%**. Large enough to read as a document, not a thumbnail.
- Maximum content width may be constrained (around 1440–1600px) and centered so ultrawide screens do not stretch forms into unreadability.
- Horizontal padding is consistent; do not let columns kiss the viewport edge.

### Tablet

- Keep two columns if width allows (~900px+).
- Reduce column padding and invoice scale slightly.
- Prefer slightly narrower editor rather than shrinking the invoice into unreadability.

### Mobile

- Single column. **Editor first, preview below.**
- Preview remains a full-width paper sheet, scaled to the screen — still readable.
- No horizontal overflow. Tables inside the invoice may compress columns, not spill off-screen.

### Structure

- Do not wrap every section in a floating card.
- Editor sections are stacked with a heading + hairline divider + fields.
- The preview is one paper surface, not a stack of nested cards.

### Header

- Single row: wordmark on the left, primary actions on the right.
- Height ~56–64px. Bottom border only. No drop shadow.
- Actions: New Invoice, Print Invoice. Settings only if they are real (e.g. currency is already in the form — do not duplicate it in a fake settings menu).

---

## 4. Typography rules

### Fonts

- **UI / editor:** IBM Plex Sans — a readable, slightly technical grotesque used in real tools.
- **Invoice document display:** IBM Plex Sans for body; IBM Plex Serif for the word “INVOICE” and large totals so the sheet feels typeset, not like a web form screenshot.

Load fonts from Google Fonts (or self-host). Do not mix more than these two families.

### Scale (approximate)

| Role | Size | Weight | Tracking |
| --- | --- | --- | --- |
| App wordmark | 16–18px | 600 | slight |
| Editor section heading | 13–14px | 600 | 0.02em, uppercase optional only if still readable |
| Field label | 12–13px | 500 | normal |
| Input text | 14px | 400 | normal |
| Helper / muted | 12px | 400 | normal |
| Invoice “INVOICE” | 28–36px | 500–600 serif | 0.04–0.08em |
| Invoice business name | 18–22px | 600 | tight |
| Invoice body | 12–13px | 400 | normal |
| Invoice table header | 10–11px | 600 | 0.06em uppercase |
| Invoice total | 16–20px | 600 | normal |

Do not use 48px+ display type in the app chrome. Do not use tiny 10px body copy in the editor.

### Hierarchy

- One dominant element on the invoice: the word INVOICE (or the business name — pick one, keep the other quieter).
- Totals row is the second-loudest element on the sheet.
- Form section headings are quieter than the invoice title; they organize work, they do not compete with the document.

### Alignment

- Editor labels sit above fields, not beside them on small widths.
- Invoice amounts are right-aligned.
- Invoice dates and meta sit in a compact block, right-aligned on desktop.

---

## 5. Color system

Use a small, named palette. No rainbow. No gradients unless printing a 1px hairline fade is somehow necessary (it is not).

| Token | Role | Suggested value |
| --- | --- | --- |
| `desk` | Page background | `#E8E6E1` (warm gray) |
| `paper` | Invoice sheet, editor surface | `#FFFFFF` |
| `ink` | Primary text | `#1C1B19` |
| `ink-muted` | Secondary text | `#6A6760` |
| `line` | Borders, dividers | `#D8D4CC` |
| `line-strong` | Invoice rules, table lines | `#C4BFB5` |
| `field` | Input background | `#FAF9F7` |
| `field-focus` | Input background when focused | `#FFFFFF` |
| `accent` | Primary actions, focus ring | `#2C4A3E` (deep forest) |
| `accent-hover` | Button hover | `#243E34` |
| `danger` | Destructive (remove item, reset confirm) | `#8A3B32` (brick, not neon red) |
| `danger-soft` | Destructive hover background | `#F6EEEC` |

Rules:

- Accent is **one color**, used for primary buttons, focus rings, and maybe the invoice header rule. Do not tint every heading with it.
- Invoice paper stays white. Do not put a green wash on the document.
- Do not use purple, electric blue, cyan, or lime.
- Contrast: body text on paper and desk must meet WCAG AA.

---

## 6. Spacing system

Use a 4px base. Prefer this scale: 4, 8, 12, 16, 20, 24, 32, 40, 48.

| Context | Spacing |
| --- | --- |
| Header vertical padding | 12–16px |
| Editor column padding | 24–32px desktop, 16–20px mobile |
| Space between editor sections | 28–36px, with a 1px divider |
| Space between fields in a section | 12–16px |
| Label to input | 6–8px |
| Invoice sheet padding | ~48px desktop equivalent (scale with the sheet) |
| Invoice block gaps (header → bill-to → table) | 24–32px |
| Table cell padding | 8–12px vertical, 0–8px horizontal |

Do not use arbitrary 13px / 27px gaps. Do not use huge empty regions “for breathing room” at the top of the page.

The editor should feel dense enough to work in, not sparse like a landing page.

---

## 7. Component rules

### General

- Build small, reusable primitives: `Button`, `Input`, `Select`, `Textarea`, and a `Field` wrapper (label + control + optional hint).
- Domain components map 1:1 to invoice sections. Do not create a generic `Card` used everywhere.
- No icon packs dumped into the UI. If an icon is used (remove row, upload), it must be a simple inline SVG and must have a text alternative.

### Editor sections

Each section:

1. Short heading (Business, Client, Details, Items, Deposit & Payment, Notes)
2. Optional one-line helper only if it prevents a mistake (e.g. “Discount is a fixed amount, not a percentage.”)
3. Fields. No nested card chrome.

### Header

- Wordmark: the word **Invoice** in the UI font, weight 600. No abstract logo mark required. If a mark is used, a small solid rectangle or typographic “I” is enough.
- No avatar, no notification bell, no “Pro” badge.

### Buttons

See section 9.

### Tables (items editor)

- Looks like a working table, not a dashboard widget.
- Header row is muted, small, with a bottom border.
- Rows are full-width. Remove control is at the end of the row, visually quieter than the fields.

---

## 8. Form / input rules

- **Every field has a visible `<label>`.** Placeholders are examples, never substitutes for labels.
- Use the correct `type`: `email`, `tel`, `url`, `date`, `number`.
- Number fields for quantity, rate, tax, and discount: `inputMode` decimal where useful; min 0; quantity may be 0 but should not go negative.
- Dates use native date inputs.
- Currency uses a `<select>` of real ISO codes with a readable label (e.g. `USD — US Dollar`).
- Focus state: 2px accent ring or border, not a glow, not a gradient.
- Disabled state is rare; prefer allowing empty fields.
- Group related fields in simple grids: 1 column on mobile, 2 columns for short fields (email / phone) on desktop.
- Address and notes are textareas, 3 rows default, resizable vertically only if it does not break the layout.
- Do not show red error walls on load. Validate lightly (e.g. ignore negative numbers by clamping).

Placeholders should be realistic:

- Business name: `Northstar Studio`
- Email: `hello@northstar.studio`
- Notes: `Thank you for your business.`

---

## 9. Button rules

Three visual roles only:

| Role | Use | Appearance |
| --- | --- | --- |
| Primary | Print Invoice | Solid accent, white text, 4–6px radius max |
| Secondary | New Invoice | White/paper fill, 1px `line` border, ink text |
| Ghost / quiet | Add item, remove item, remove logo | Text or hairline; no heavy fill |

Rules:

- Border radius: **4px or 6px**. Never 9999 pill buttons in the chrome. Never 16px+ “soft UI” buttons.
- Height: ~36–40px for header actions; slightly smaller inside the items table.
- No drop shadows on buttons.
- Hover: slightly darker fill (primary) or slightly darker border (secondary). Instant, no bounce.
- Focus-visible: accent outline, 2px offset.
- Icon-only buttons: square, same height, **must** have `aria-label`.
- Destructive actions (remove item) use danger color on hover, not only an unlabeled trash icon.
- Do not use two competing primary buttons in the header. **Print** is primary. **New invoice** is secondary.

---

## 10. Invoice preview rules

The preview is a **sheet of paper**, not a card component.

### Sheet

- White background.
- Aspect ratio approximates A4 (1 : 1.414). On screen it may be width-fluid with min-height so it still reads as a page.
- Very light shadow (one, soft, low opacity) so it lifts off the desk. No stacked shadows, no colored glow.
- Hairline border `#D8D4CC` or similar.
- Interior padding generous, like a real invoice (~12–14mm visual equivalent).
- Corner radius: **0–2px**. A printed page is not a rounded rectangle. Prefer square.

### Document layout (top to bottom)

1. Letterhead: optional logo (max height ~48–56px) + business name + contact lines (email, phone, address, website). Contact is muted, smaller, stacked or compact.
2. A thin horizontal rule.
3. Title row: “INVOICE” on the left (serif). Meta on the right: number, issue date, due date. Labels muted, values ink.
4. Bill To block: heading “Bill to” (small, uppercase or small caps via tracking), then client name (semibold) and contact.
5. Line-item table: Description \| Qty \| Rate \| Amount. Header has a bottom border. Last row has a bottom border. Qty/Rate/Amount right-aligned and tabular.
6. Totals: right-aligned stack — Subtotal, Discount, Tax, Total. If a deposit is entered, also show Deposit and Amount due. Amount due (or Total, when there is no deposit) is emphasized with weight and a rule above it. Show currency symbol/code consistently.
7. Notes / payment terms at the bottom, muted, not competing with totals. If empty, omit the block entirely (do not print “Notes:” with nothing under it).

### Empty states on the sheet

- Missing business name → show a quiet placeholder such as `Your business` in muted type, not “ACME CORP INC.”
- Zero items → table header still shows; one muted row: `No items yet`.
- Logo absent → do not leave a broken image; just start with the name.

### What not to do

- Do not put each of these blocks in its own rounded card.
- Do not use colored table header backgrounds spanning the full width in a “dashboard table” style. A 1px rule is enough. A very light warm-gray header fill is acceptable if it stays quiet.
- Do not watermark “DRAFT” unless the user asked for it.
- Do not add QR codes, fake barcodes, or “scan to pay.”

---

## 11. Responsive behavior

- **Desktop-first.** Design the two-pane editor at 1280px, then adapt down.
- Breakpoints (guidance):  
  - `lg` (~1024px+): two columns, 40/60.  
  - `md` (~768–1023): two columns if readable, else stack. Prefer stacking below ~900px.  
  - below `md`: stack, editor then preview.
- Invoice preview on small screens: width 100% of the column; font sizes reduce slightly but body copy stays ≥11px rendered.
- Item editor on mobile: stack each item’s fields vertically (description full width; qty / rate / amount on one row) rather than a cramped 5-column table.
- Header actions wrap if needed; never overflow.
- Print media ignores screen breakpoints: always one A4-like page.

---

## 12. Accessibility

- Semantic structure: `<header>`, `<main>`, `<section>`, headings in order (`h1` is the product name or “Invoice editor”; invoice sheet may use `h2` for “Invoice”).
- All inputs associated with labels via `htmlFor` / `id`.
- Keyboard: tab order follows visual order (header → editor top to bottom → preview is not a focus trap).
- `focus-visible` styles on every interactive element. Do not `outline: none` without a replacement.
- Icon-only controls: `aria-label` (e.g. `Remove item`, `Remove logo`).
- File input for logo: visible label “Logo” plus a button “Choose image”.
- Color is not the only signal: removal is labeled; totals are labeled with words (Subtotal, Tax, Total).
- Contrast: ink on paper, muted text still ≥ 4.5:1 where it is readable content.
- `prefers-reduced-motion`: no motion beyond instant color/border changes.
- Print button is a real `<button>` that calls `window.print()`, not a fake link.

---

## 13. UX principles

1. **Live preview is the feedback.** Typing in the editor should update the sheet immediately. No “Generate” step.
2. **Sensible defaults.** New invoices start with a sample so the sheet is understandable, plus a real invoice number and today’s date. Due date defaults to 14 days after issue.
3. **Obvious math.** Quantity × rate = amount, shown per row. Totals always derived, never typed by the user as a source of truth.
4. **Forgiving numbers.** Empty quantity/rate treat as 0. Discount cannot exceed subtotal in the displayed total (clamp for display if needed, or allow it but never produce NaN).
5. **New invoice is a reset.** Clearing localStorage draft and restoring defaults. Confirm if the current invoice has more than trivial changes — a `window.confirm` is enough; no modal theatre.
6. **Print is the export.** Users know print-to-PDF. Do not invent a fake “Download PDF” that does not work.
7. **Speed.** Adding a row focuses the new description field when practical.
8. **Honesty.** Do not pretend the app emailed anyone.

---

## 14. Anti-AI-slop rules

Forbidden visual patterns:

- Purple-to-blue gradients, mesh gradients, aurora backgrounds
- Glassmorphism, blur panels, neon glow
- Giant rounded-2xl / rounded-3xl cards stacked in a dashboard grid
- Soft floating shadows on every box
- Pill tags everywhere
- Decorative blobs, waves, or isometric illustrations
- Huge hero with a headline and three feature columns
- Fake metrics: invoice counts, revenue, “98% paid”
- Fake avatars, fake notifications, fake team switcher
- Inter + gradient + rounded cards as the default “AI app” look
- Centered marketing copy above the editor
- Emoji as UI decoration
- Animated gradients, bounce, page-load fade choreography

Forbidden copy (examples — the category is banned, not only these strings):

- “Empower your business”
- “Supercharge your workflow”
- “Next-generation invoicing”
- “Seamlessly manage…”
- “Unlock powerful…”
- “Revolutionize your business”
- “Welcome to your dashboard”
- “Everything you need to manage your business”
- “Built for teams that move fast”
- “Transform your workflow”
- “Your all-in-one solution”

If a section looks like a template landing page or a generic admin kit, **redesign it** toward a desk + paper + form.

What to do instead:

- Neutral desk background, white paper, hairline borders
- Typography and alignment do the work
- Short, specific labels: Business, Client, Items, Print invoice
- Sample data that looks like a real job (design hours, print production) not “Item 1 / Lorem ipsum”

---

## 15. Content / copywriting rules

Voice: **direct, specific, slightly dry.** Like a well-made accounting tool, not a brand campaign.

| Instead of | Write |
| --- | --- |
| “Empower your invoicing journey” | (nothing — just show the editor) |
| “Add a new line item to your invoice” | “Add item” |
| “Let’s get started” | (no empty-state pep talk) |
| “Payment terms & additional notes” | “Notes” and “Payment terms” as two labels |
| “Crafted with care” in a footer | No marketing footer |

UI copy inventory (keep close to this):

- Wordmark: `Invoice`
- Buttons: `New invoice`, `Print invoice`, `Add item`, `Remove`, `Choose image`, `Remove logo`
- Sections: `Business`, `Client`, `Invoice details`, `Items`, `Deposit & Payment`, `Notes`
- Invoice sheet: `INVOICE`, `Bill to`, `Description`, `Qty`, `Rate`, `Amount`, `Subtotal`, `Discount`, `Tax`, `Total`, `Deposit`, `Amount due`
- Confirm reset: `Start a new invoice? The current draft will be cleared.`

Placeholders are examples of content, not instructions. Do not use “Enter your business name here.”

Do not force default notes onto a printed invoice if the user clears them. Empty notes = omitted block.

---

## 16. Code quality rules

### Stack

- React + Vite
- TypeScript
- Tailwind CSS
- No backend, no database, no auth, no `fetch` to product APIs, no analytics scripts

### Structure

```
src/
  components/   # UI pieces listed in the product spec
  hooks/        # useInvoice (state, persistence, actions)
  utils/        # money math and formatting only
  data/         # currencies, default invoice
  types/        # Invoice model
  App.tsx
  main.tsx
```

Keep `App.tsx` as composition: header + editor + preview. Business logic lives in the hook and utils.

### Calculations

Pure functions, unit-testable in principle:

- `lineAmount(quantity, rate)`
- `subtotal(items)`
- `discountAmount(discount)` — fixed currency amount
- `taxAmount(subtotal, discount, taxRate)`
- `total(...)`
- `depositAmount(deposit, total)` — clamped so it cannot exceed the total
- `formatMoney(amount, currency)`

Never hardcode totals in the preview. Never store `amount` as source of truth on an item; derive it.

Tax is calculated on **(subtotal − discount)**, unless discount is 0. Do not tax the discount.

Guard against `NaN`: coerce invalid numeric input to 0.

### State

Match this shape (fields may be added only if used):

```ts
{
  business: { name, email, phone, address, website, logo },
  client: { name, email, phone, address },
  details: { invoiceNumber, issueDate, dueDate, currency },
  items: [{ id, description, quantity, rate }],
  taxRate,      // percent, e.g. 8
  discount,     // money amount in invoice currency
  deposit,      // amount already received; subtracted from total
  notes,
  paymentTerms
}
```

`logo` is a data URL string or `null`. Never upload it.

### Persistence

- `localStorage` key: `invoice:draft`
- Save on change (debounce ~200–300ms is fine)
- Hydrate on load; if parse fails, use defaults
- New invoice writes defaults and replaces storage

### Print

- `@media print`: hide `[data-print-hide]`, show only the invoice sheet
- Zero app chrome, zero buttons
- White background, no desk color
- Avoid breaking the totals block across pages when possible (`break-inside: avoid`)

### Hygiene

- No unused imports, components, or CSS
- No `TODO` left in source
- No `console.log` in production code
- Build must succeed
- All listed user actions must work: add/remove/edit items, calc, currency, dates, number, business/client, logo add/remove, notes/terms, reset, print

### Review before done

Walk the UI looking for AI slop (section 14). If the editor looks like nested rounded cards on a gradient, strip chrome until it looks like a form beside a piece of paper.
