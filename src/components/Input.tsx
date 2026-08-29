import type { InputHTMLAttributes } from "react";
import { controlClassName } from "./controlStyles";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", type = "text", ...props }: InputProps) {
  const dateClass =
    type === "date"
      ? "cursor-pointer [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
      : "";

  return (
    <input
      type={type}
      className={`${controlClassName} ${dateClass} ${className}`}
      {...props}
    />
  );
}
