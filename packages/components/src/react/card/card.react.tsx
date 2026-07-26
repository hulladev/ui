import { cardVariants } from "@/+css/card.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithoutRef } from "react"

const $variant = resolve(cardVariants)

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
