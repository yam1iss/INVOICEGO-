import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-ink hover:bg-accent-hover border border-accent font-semibold",
  secondary:
    "bg-paper text-ink border border-line hover:border-line-strong hover:bg-field",
  ghost:
    "bg-transparent text-ink-muted border border-transparent hover:text-ink hover:bg-field",
  danger:
    "bg-transparent text-ink-muted border border-transparent hover:text-danger hover:bg-danger-soft",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "secondary",
      className = "",
      type = "button",
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex min-h-10 items-center justify-center gap-2 px-3.5 text-sm font-medium rounded-[2px] cursor-pointer touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);
