import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { getDocumentConfig, type DocumentType } from "../data/documentTypes";

const SHEET_WIDTH_PX = 794;
const SHEET_HEIGHT_PX = Math.round(SHEET_WIDTH_PX * (297 / 210));
const SHEET_BACKGROUND = "#FFFDF6";
const FIT_ONE_PAGE_RATIO = 1.45;
const PAGE_OVERFLOW_MM = 1.5;

export async function createInvoicePdf(
  invoiceNumber: string,
  documentType: DocumentType = "invoice",
): Promise<{ save: () => Promise<void>; filename: string }> {
  const source = document.querySelector<HTMLElement>("[data-invoice-sheet]");
  if (!source) {
    throw new Error("Invoice preview not found.");
  }

  // Use a fixed host at origin (0, 0) behind the download overlay so browsers
  // (both iOS Safari and Android Chrome) calculate exact layouts and font metrics.
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "z-index:9000",
    `width:${SHEET_WIDTH_PX}px`,
    `min-width:${SHEET_WIDTH_PX}px`,
    `max-width:${SHEET_WIDTH_PX}px`,
    `background:${SHEET_BACKGROUND}`,
    "pointer-events:none",
  ].join(";");

  const clone = source.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-pdf-clone", "");
  clone.style.width = `${SHEET_WIDTH_PX}px`;
  clone.style.minWidth = `${SHEET_WIDTH_PX}px`;
  clone.style.maxWidth = `${SHEET_WIDTH_PX}px`;
  clone.style.border = "none";
  clone.style.boxShadow = "none";
  clone.style.display = "flex";
  clone.style.flexDirection = "column";
  clone.style.height = "auto";
  clone.style.minHeight = "0";
  clone.style.backgroundColor = SHEET_BACKGROUND;
  clone.style.boxSizing = "border-box";
  clone.style.overflow = "visible";

  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    await waitForImages(clone);
    // iOS paints logos at natural pixel size unless width/height are set explicitly.
    constrainLogoImages(clone);
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    await waitTwoFrames();
    await sleep(60);

    const credit = clone.querySelector<HTMLElement>(".mt-auto");
    if (credit) {
      credit.classList.remove("mt-auto");
      credit.style.marginTop = "0";
    }

    void clone.offsetHeight;
    const contentHeight = Math.max(
      1,
      Math.ceil(clone.getBoundingClientRect().height),
    );
    const fitsOnePage = contentHeight <= SHEET_HEIGHT_PX;

    if (fitsOnePage) {
      const extra = SHEET_HEIGHT_PX - contentHeight;
      if (credit) {
        credit.style.marginTop = `${Math.max(0, extra)}px`;
      }
      clone.style.height = `${SHEET_HEIGHT_PX}px`;
      clone.style.minHeight = `${SHEET_HEIGHT_PX}px`;
      clone.style.overflow = "hidden";
    }

    const captureHeight = fitsOnePage
      ? SHEET_HEIGHT_PX
      : Math.max(1, Math.ceil(clone.getBoundingClientRect().height));

    const scale = 2;

    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      backgroundColor: SHEET_BACKGROUND,
      logging: false,
      width: SHEET_WIDTH_PX,
      height: captureHeight,
      windowWidth: SHEET_WIDTH_PX,
      windowHeight: captureHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (doc, clonedEl) => {
        doc.documentElement.style.width = `${SHEET_WIDTH_PX}px`;
        doc.documentElement.style.minWidth = `${SHEET_WIDTH_PX}px`;
        doc.documentElement.style.maxWidth = `${SHEET_WIDTH_PX}px`;
        doc.documentElement.style.background = SHEET_BACKGROUND;
        doc.body.style.width = `${SHEET_WIDTH_PX}px`;
        doc.body.style.minWidth = `${SHEET_WIDTH_PX}px`;
        doc.body.style.maxWidth = `${SHEET_WIDTH_PX}px`;
        doc.body.style.margin = "0";
        doc.body.style.padding = "0";
        doc.body.style.background = SHEET_BACKGROUND;

        // Re-apply on the iframe clone — iOS often drops CSS-only image limits.
        constrainLogoImages(clonedEl);
      },
    });

    const image = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;

    const fillPage = () => {
      pdf.setFillColor(255, 253, 246);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
    };

    if (imageHeight <= pageHeight + PAGE_OVERFLOW_MM) {
      fillPage();
      pdf.addImage(image, "PNG", 0, 0, imageWidth, imageHeight, undefined, "FAST");
    } else if (imageHeight <= pageHeight * FIT_ONE_PAGE_RATIO) {
      const fit = pageHeight / imageHeight;
      const width = imageWidth * fit;
      const x = (pageWidth - width) / 2;
      fillPage();
      pdf.addImage(image, "PNG", x, 0, width, pageHeight, undefined, "FAST");
    } else {
      let remaining = imageHeight;
      let offset = 0;

      fillPage();
      pdf.addImage(image, "PNG", 0, offset, imageWidth, imageHeight, undefined, "FAST");
      remaining -= pageHeight;

      while (remaining > PAGE_OVERFLOW_MM) {
        offset -= pageHeight;
        pdf.addPage();
        fillPage();
        pdf.addImage(
          image,
          "PNG",
          0,
          offset,
          imageWidth,
          imageHeight,
          undefined,
          "FAST",
        );
        remaining -= pageHeight;
      }
    }

    const filename = pdfFileName(invoiceNumber, documentType);
    return {
      filename,
      save: async () => {
        await savePdf(pdf, filename);
      },
    };
  } finally {
    host.remove();
  }
}

export async function downloadInvoicePdf(
  invoiceNumber: string,
  documentType: DocumentType = "invoice",
): Promise<void> {
  const prepared = await createInvoicePdf(invoiceNumber, documentType);
  await prepared.save();
}

export function pdfFileName(
  invoiceNumber: string,
  documentType: DocumentType = "invoice",
): string {
  const config = getDocumentConfig(documentType);
  const title = config.title;
  const number = invoiceNumber
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ");

  if (!number) return `${title}.pdf`;
  return `${title} ${number}.pdf`;
}

async function savePdf(pdf: jsPDF, filename: string): Promise<void> {
  const blob = pdf.output("blob");
  const file = new File([blob], filename, { type: "application/pdf" });

  // Mobile: open the native share sheet with the PDF file only.
  // Do not pass url/text — that is what produces the blob:… string in WhatsApp.
  // Do not open a preview tab on iOS after sharing.
  if (isMobile() && canShareFile(file)) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (error) {
      // User cancelled the share sheet — stop; do not open a preview fallback.
      if (error instanceof Error && error.name === "AbortError") return;
      // Share failed for another reason — fall through to download below.
    }
  }

  // Desktop / fallback: trigger a normal file download (no new tab, no blob URL share).
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function canShareFile(file: File): boolean {
  return (
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

function isMobile(): boolean {
  return (
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
  );
}

function waitTwoFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);
}

/** Max logo box in the A4 PDF clone (matches preview h-14 / max-w-14rem). */
const LOGO_MAX_HEIGHT_PX = 56;
const LOGO_MAX_WIDTH_PX = 224;

/**
 * iOS Safari + html2canvas often ignore CSS max-width/max-height on <img>
 * and paint at the image's natural pixel size. Set explicit pixel dimensions
 * via attributes + inline styles so the logo stays header-sized.
 */
function constrainLogoImages(root: HTMLElement): void {
  const images = Array.from(root.querySelectorAll("img"));
  for (const img of images) {
    const naturalW = img.naturalWidth || LOGO_MAX_WIDTH_PX;
    const naturalH = img.naturalHeight || LOGO_MAX_HEIGHT_PX;
    if (naturalW <= 0 || naturalH <= 0) continue;

    const scale = Math.min(
      LOGO_MAX_WIDTH_PX / naturalW,
      LOGO_MAX_HEIGHT_PX / naturalH,
      1,
    );
    const width = Math.max(1, Math.round(naturalW * scale));
    const height = Math.max(1, Math.round(naturalH * scale));

    img.setAttribute("width", String(width));
    img.setAttribute("height", String(height));
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.style.maxWidth = `${LOGO_MAX_WIDTH_PX}px`;
    img.style.maxHeight = `${LOGO_MAX_HEIGHT_PX}px`;
    img.style.objectFit = "contain";
    img.style.display = "block";
    img.style.flexShrink = "0";
  }
}
