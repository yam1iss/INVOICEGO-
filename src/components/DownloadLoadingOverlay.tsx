import { useEffect, useState } from "react";
import { InvoiceGoMark } from "./InvoiceGoMark";

type DownloadLoadingOverlayProps = {
  documentTitle: string;
  onAnimationComplete: () => Promise<void>;
  onDone: () => void;
};

export function DownloadLoadingOverlay({
  documentTitle,
  onAnimationComplete,
  onDone,
}: DownloadLoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [statusText, setStatusText] = useState("Preparing document layout…");

  useEffect(() => {
    let unmounted = false;
    const startTime = Date.now();
    const duration = 2600; // Progress bar takes 2.6s to hit 100%

    const interval = setInterval(async () => {
      if (unmounted) return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);

        // 1. Progress hit 100% -> Stop animation, settle the logo back into place
        setStatusText("Ready! Finalizing file…");

        // 2. Pause for 0.5s (500ms) with the settled logo
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (unmounted) return;

        // 3. Trigger the PDF download
        try {
          await onAnimationComplete();
        } catch (err) {
          console.error("PDF download error:", err);
        }

        if (unmounted) return;

        // 4. Show the "Yay! downloaded!" celebration
        setIsSuccess(true);
        setStatusText(`Yay! ${documentTitle} downloaded!`);

        // 5. Keep celebration visible for 900ms, then smoothly fade out
        setTimeout(() => {
          if (!unmounted) {
            setIsClosing(true);
            setTimeout(() => {
              if (!unmounted) {
                onDone();
              }
            }, 350);
          }
        }, 900);
      } else if (pct > 65) {
        setStatusText(`Finalizing ${documentTitle} PDF…`);
      } else if (pct > 30) {
        setStatusText("Rendering pages & formatting elements…");
      }
    }, 25);

    return () => {
      unmounted = true;
      clearInterval(interval);
    };
  }, [documentTitle, onAnimationComplete, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white px-6 select-none transition-opacity duration-350 ease-in-out ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex w-full max-w-sm flex-col items-center text-center transition-transform duration-350 ease-out ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Animated Logo Container */}
        <div className="relative mb-5 flex items-center justify-center">
          <div
            className={`absolute -inset-4 rounded-full blur-xl transition-all duration-500 ${
              isSuccess
                ? "bg-accent/40 scale-125"
                : progress >= 100
                  ? "bg-accent/30 scale-100"
                  : "bg-accent/25 animate-pulse"
            }`}
          />

          <InvoiceGoMark
            className={`relative h-16 w-16 drop-shadow-sm transition-all duration-300 sm:h-20 sm:w-20 ${
              isSuccess
                ? "scale-110"
                : progress >= 100
                  ? "scale-100 transform-none"
                  : "animate-bounce"
            }`}
          />
        </div>

        {/* Brand Name */}
        <div className="mb-2 flex items-center gap-1 font-[family-name:var(--font-logo)] text-2xl font-black uppercase tracking-tight text-ink">
          <span>Invoice</span>
          <span className="text-accent">Go!</span>
        </div>

        {/* Status Message */}
        <p
          className={`mb-6 h-5 text-xs font-semibold transition-colors duration-200 sm:text-sm ${
            isSuccess ? "text-ink font-bold" : "text-ink-muted"
          }`}
        >
          {statusText}
        </p>

        {/* Progress Bar */}
        <div className="w-full overflow-hidden rounded-full border border-line bg-field p-1 shadow-inner">
          <div
            className={`h-2.5 rounded-full bg-accent transition-all duration-150 ease-out ${
              isSuccess ? "shadow-[0_0_12px_rgba(245,196,0,0.8)]" : ""
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <span className="mt-2.5 text-xs font-semibold tabular-nums text-ink-muted">
          {progress}%
        </span>
      </div>
    </div>
  );
}
