import type { TextareaHTMLAttributes } from "react";
import { controlClassName } from "./controlStyles";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`${controlClassName} h-auto min-h-[6.5rem] py-2.5 leading-relaxed resize-y ${className}`}
      {...props}
    />
  );
}
