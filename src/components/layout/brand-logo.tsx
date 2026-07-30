import clsx from "clsx";

type Props = {
  className?: string;
};

export function BrandLogo({ className }: Props) {
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm",
        className
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none">
        <path d="M13 8.5C13 7.12 14.12 6 15.5 6h17C33.88 6 35 7.12 35 8.5V40L24 33.45 13 40V8.5Z" fill="currentColor" />
        <rect x="18" y="14" width="5" height="5" rx="1.2" fill="#2563EB" />
        <rect x="25" y="14" width="5" height="5" rx="1.2" fill="#93C5FD" />
        <rect x="18" y="22" width="5" height="5" rx="1.2" fill="#BFDBFE" />
        <rect x="25" y="22" width="5" height="5" rx="1.2" fill="#2563EB" />
      </svg>
    </div>
  );
}

