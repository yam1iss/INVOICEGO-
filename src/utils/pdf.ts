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

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    "left:0",
    "top:0",
    "z-index:9000",
    `width:${SHEET_WIDTH_PX}px`,
    `background:${SHEET_BACKGROUND}`,
    "pointer-events:none",
  ].join(";");

  const clone = source.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-pdf-clone", "");
  clone.style.width = `${SHEET_WIDTH_PX}px`;
  clone.style.maxWidth = "none";
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
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    await waitTwoFrames();
    await sleep(50);

    const credit = clone.querySelector<HTMLElement>(".mt-auto");
    if (credit) {
      credit.classList.remove("mt-auto");
      credit.style.marginTop = "0";
    }

    void clone.offsetHeight;
    const contentHeight = Math.max(1, Math.ceil(clone.getBoundingClientRect().height));
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
    const scale = isMobile() ? 1.5 : 2;
    const useJpeg = isMobile();

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
      onclone: (doc) => {
        doc.documentElement.style.width = `${SHEET_WIDTH_PX}px`;
        doc.body.style.width = `${SHEET_WIDTH_PX}px`;
        doc.body.style.margin = "0";
        doc.body.style.background = SHEET_BACKGROUND;
      },
    });

    const image = useJpeg
      ? canvas.toDataURL("image/jpeg", 0.92)
      : canvas.toDataURL("image/png");
    const imageFormat = useJpeg ? "JPEG" : "PNG";
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
      pdf.addImage(image, imageFormat, 0, 0, imageWidth, imageHeight, undefined, "FAST");
    } else if (imageHeight <= pageHeight * FIT_ONE_PAGE_RATIO) {
      const fit = pageHeight / imageHeight;
      const width = imageWidth * fit;
      const x = (pageWidth - width) / 2;
      fillPage();
      pdf.addImage(image, imageFormat, x, 0, width, pageHeight, undefined, "FAST");
    } else {
      let remaining = imageHeight;
      let offset = 0;

      fillPage();
      pdf.addImage(image, imageFormat, 0, offset, imageWidth, imageHeight, undefined, "FAST");
      remaining -= pageHeight;

      while (remaining > PAGE_OVERFLOW_MM) {
        offset -= pageHeight;
        pdf.addPage();
        fillPage();
        pdf.addImage(
          image,
          imageFormat,
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

  if (isMobile() && canShareFile(file)) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (isIOS()) {
    window.open(url, "_blank");
  }

  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function canShareFile(file: File): boolean {
  return typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
}

function isMobile(): boolean {
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
}

function isIOS(): boolean {
  return (
    /iP(ad|hone|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
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
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  ).then(() => undefined);
}
