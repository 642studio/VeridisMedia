/**
 * VERIDIS MEDIA logo — the "eye-in-circle" brand mark recreated as a vector with
 * the cyan → violet → magenta brand gradient, plus the wordmark.
 *
 * To use the official raster/vector instead, drop it in /public and swap the
 * <BrandMark/> for an <Image/> — the layout stays the same.
 */
function BrandMark({ size = 24, id = "veridis" }: { size?: number; id?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="55%" stopColor="#7b61ff" />
          <stop offset="100%" stopColor="#c948e6" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="12" cy="12" r="10" stroke={`url(#${id}-grad)`} strokeWidth="1.7" />
      {/* Inner vertical eye / lens */}
      <path
        d="M12 5.4C9.4 8 9.4 16 12 18.6C14.6 16 14.6 8 12 5.4Z"
        fill={`url(#${id}-grad)`}
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={24} id="logo" />
      <span className="font-display text-[18px] font-medium leading-none tracking-[-0.01em] text-phosphor">
        VERIDIS<span className="text-lichen"> MEDIA</span>
      </span>
    </span>
  );
}

export { BrandMark };
