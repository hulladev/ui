import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $variant = vn({
  outline: "border-border bg-surface shadow-xs",
  elevated:
    "border-[color-mix(in_oklab,var(--color-foreground)_16%,transparent)] bg-[linear-gradient(145deg,var(--color-surface-raised)_0%,color-mix(in_oklab,var(--color-surface-raised)_88%,var(--color-background))_100%)] shadow-[0_1px_2px_oklch(0_0_0/0.1),0_12px_28px_-22px_oklch(0_0_0/0.55)]",
  ghost: "border-transparent bg-transparent shadow-none",
})

export type CardProps = ComponentPropsWithoutRef<"article"> & {
  variant?: typeof $variant.infer
}

export function Card({ children, className, variant = "outline", ...props }: CardProps) {
  return (
    <article
      {...props}
      data-slot="card"
      data-variant={variant}
      className={cn(
        "group/card flex min-w-0 flex-col gap-6 rounded-lg border p-6 text-foreground",
        $variant(variant),
        className
      )}
    >
      {children}
    </article>
  )
}
