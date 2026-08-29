import { useEffect, useRef, type RefObject } from "react";

export function useDismiss(
  open: boolean,
  onClose: () => void,
  refs: Array<RefObject<HTMLElement | null>>,
) {
  const onCloseRef = useRef(onClose);
  const refsRef = useRef(refs);
  onCloseRef.current = onClose;
  refsRef.current = refs;

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      const inside = refsRef.current.some((ref) =>
        ref.current?.contains(target),
      );
      if (!inside) onCloseRef.current();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
}
