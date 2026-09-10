import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $variant = vn({
  outline: "border-border bg-surface shadow-xs",
  elevated: "border-border bg-surface-raised shadow-(--shadow-raised) ",
  ghost: "border-transparent bg-transparent shadow-none",
})

export type CardProps = ComponentPropsWithRef<"article"> & {
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
