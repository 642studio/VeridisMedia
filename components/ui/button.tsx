import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "reactor" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[4px] px-5 py-2.5 text-[14px] font-medium leading-none tracking-[-0.022em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reactor focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Filled action — reserved for the highest-priority CTA
  reactor: "bg-reactor text-void hover:bg-soft-glow",
  // Secondary — transparent with fern border that intensifies to reactor on hover
  ghost:
    "bg-transparent text-phosphor border border-fern hover:border-reactor",
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "reactor", children, className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
