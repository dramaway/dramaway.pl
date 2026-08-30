import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  /** Drop the padded container so children can reach the container edge. */
  bleed?: boolean;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
};

export function Section({
  children,
  bleed = false,
  className,
  id,
  ...rest
}: SectionProps) {
  return (
    <section id={id} className={cn("py-section", className)} {...rest}>
      {bleed ? children : <div className="page">{children}</div>}
    </section>
  );
}
