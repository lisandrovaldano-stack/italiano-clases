export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="8" fill="#fbfaf7" />
      <rect x="1.5" y="1.5" width="29" height="29" rx="6.5" fill="none" stroke="#e3ded3" />
      <path d="M2 8a6 6 0 0 1 6-6h6v28H8a6 6 0 0 1-6-6z" fill="#008148" />
      <rect x="13" y="2" width="6" height="28" fill="#fbfaf7" />
      <path d="M19 2h5a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6h-5z" fill="#ce2b37" />
    </svg>
  );
}
