/**
 * VERIDIS MEDIA logo — usa el ícono oficial (archivos en /public) + wordmark.
 * variant: "white" para fondos oscuros (nav/footer), "color" para destacar (hero).
 */
function BrandMark({
  size = 24,
  variant = "white",
  className = "",
}: {
  size?: number;
  variant?: "white" | "color";
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/veridis-mark-${variant}.svg`}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={26} variant="white" />
      <span className="font-display text-[18px] font-medium leading-none tracking-[-0.01em] text-phosphor">
        VERIDIS<span className="text-lichen"> MEDIA</span>
      </span>
    </span>
  );
}

export { BrandMark };
