import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentType } from "../data/documentTypes";
import { createDefaultInvoice } from "../data/defaults";
import type { LineColor, LineTheme } from "../data/lineThemes";
import type {
  BusinessInfo,
  ClientInfo,
  Invoice,
  InvoiceDetails,
  InvoiceItem,
} from "../types/invoice";
import { clampPercent } from "../utils/calculations";
import { createItemId } from "../utils/format";
import { clearInvoice, loadInvoice, saveInvoice } from "../utils/storage";

const SAVE_DELAY_MS = 250;
const MAX_LOGO_BYTES = 1_500_000;

export function useInvoice() {
  const [invoice, setInvoice] = useState<Invoice>(() => loadInvoice());
  const [focusItemId, setFocusItemId] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (saveTimer.current !== null) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      saveInvoice(invoice);
    }, SAVE_DELAY_MS);

    return () => {
      if (saveTimer.current !== null) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [invoice]);

  const updateBusiness = useCallback((patch: Partial<BusinessInfo>) => {
    setInvoice((current) => ({
      ...current,
      business: { ...current.business, ...patch },
    }));
  }, []);

  const updateClient = useCallback((patch: Partial<ClientInfo>) => {
    setInvoice((current) => ({
      ...current,
      client: { ...current.client, ...patch },
    }));
  }, []);

  const updateDetails = useCallback((patch: Partial<InvoiceDetails>) => {
    setInvoice((current) => ({
      ...current,
      details: { ...current.details, ...patch },
    }));
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<Omit<InvoiceItem, "id">>) => {
      setInvoice((current) => ({
        ...current,
        items: current.items.map((item) => {
          if (item.id !== id) return item;
          const next = { ...item, ...patch };
          if (patch.discount !== undefined) {
            next.discount = clampPercent(patch.discount);
          }
          return next;
        }),
      }));
    },
    [],
  );

  const addItem = useCallback(() => {
    const id = createItemId();
    setInvoice((current) => ({
      ...current,
      items: [
        ...current.items,
        { id, description: "", quantity: 1, rate: 0, discount: 0 },
      ],
    }));
    setFocusItemId(id);
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoice((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }, []);

  const setLogo = useCallback((file: File) => {
    if (file.size > MAX_LOGO_BYTES) {
      window.alert("Please choose an image smaller than 1.5 MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setInvoice((current) => ({
          ...current,
          business: { ...current.business, logo: result },
        }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const removeLogo = useCallback(() => {
    setInvoice((current) => ({
      ...current,
      business: { ...current.business, logo: null },
    }));
  }, []);

  const setTaxRate = useCallback((taxRate: number) => {
    setInvoice((current) => ({ ...current, taxRate: Math.max(0, taxRate) }));
  }, []);

  const setDiscount = useCallback((discount: number) => {
    setInvoice((current) => ({ ...current, discount: Math.max(0, discount) }));
  }, []);

  const setDeposit = useCallback((deposit: number) => {
    setInvoice((current) => ({ ...current, deposit: Math.max(0, deposit) }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setInvoice((current) => ({ ...current, notes }));
  }, []);

  const setPaymentTerms = useCallback((paymentTerms: string) => {
    setInvoice((current) => ({ ...current, paymentTerms }));
  }, []);

  const setLineTheme = useCallback((lineTheme: LineTheme) => {
    setInvoice((current) => ({ ...current, lineTheme }));
  }, []);

  const setLineColor = useCallback((lineColor: LineColor) => {
    setInvoice((current) => ({ ...current, lineColor }));
  }, []);

  const setDocumentType = useCallback((documentType: DocumentType) => {
    setInvoice((current) => ({ ...current, documentType }));
  }, []);

  const reset = useCallback((docType?: DocumentType) => {
    clearInvoice();
    setInvoice((current) => createDefaultInvoice(new Date(), docType ?? current.documentType ?? "invoice"));
    setFocusItemId(null);
  }, []);

  const clearItemFocus = useCallback(() => {
    setFocusItemId(null);
  }, []);

  return {
    invoice,
    focusItemId,
    clearItemFocus,
    updateBusiness,
    updateClient,
    updateDetails,
    updateItem,
    addItem,
    removeItem,
    setLogo,
    removeLogo,
    setTaxRate,
    setDiscount,
    setDeposit,
    setNotes,
    setPaymentTerms,
    setLineTheme,
    setLineColor,
    setDocumentType,
    reset,
  };
}

export type InvoiceController = ReturnType<typeof useInvoice>;
