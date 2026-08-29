type InvoiceGoMarkProps = {
  className?: string;
};

export function InvoiceGoMark({ className = "" }: InvoiceGoMarkProps) {
  return (
    <svg
      viewBox="0 0 53 56"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M20 6h20l12 12v26H20V6z"
        stroke="#0A0A0A"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M40 6l12 12H40V6z" fill="#F5C400" />
      <path
        d="M40 6v12h12"
        stroke="#0A0A0A"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M28 22h18M28 29h18"
        stroke="#0A0A0A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="22" cy="44" r="10" fill="#F5C400" />
      <path
        d="M17.2 44.2 21 48l7.2-8.4"
        stroke="#0A0A0A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 39.5h11M1 44h13M3 48.5h10"
        stroke="#F5C400"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
