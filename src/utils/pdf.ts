import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const SHEET_WIDTH_PX = 794;
const SHEET_HEIGHT_PX = Math.round(SHEET_WIDTH_PX * (297 / 210));
const SHEET_BACKGROUND = "#FFFDF6";
/** Scale onto one A4 page when overflow is modest (notes/footer should not jump). */
const FIT_ONE_PAGE_RATIO = 1.45;
const PAGE_OVERFLOW_MM = 1.5;

export async function downloadInvoicePdf(invoiceNumber: string): Promise<void> {
  const source = document.querySelector<HTMLElement>("[data-invoice-sheet]");
  if (!source) {
    throw new Error("Invoice preview not found.");
  }

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
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

    const credit = clone.querySelector<HTMLElement>(".mt-auto");
    if (credit) {
      credit.classList.remove("mt-auto");
      credit.style.marginTop = "0";
    }

    void clone.offsetHeight;
    const contentHeight = Math.ceil(clone.getBoundingClientRect().height);
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
      : Math.ceil(clone.getBoundingClientRect().height);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: SHEET_BACKGROUND,
      logging: false,
      width: SHEET_WIDTH_PX,
      height: captureHeight,
      windowWidth: SHEET_WIDTH_PX,
      windowHeight: captureHeight,
      scrollX: 0,
      scrollY: 0,
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
      const scale = pageHeight / imageHeight;
      const width = imageWidth * scale;
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

    pdf.save(pdfFileName(invoiceNumber));
  } finally {
    host.remove();
  }
}

export function pdfFileName(invoiceNumber: string): string {
  const number = invoiceNumber
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ");

  if (!number) return "Invoice.pdf";
  return `Invoice ${number}.pdf`;
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
