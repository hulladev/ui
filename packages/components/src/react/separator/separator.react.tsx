import { separatorOrientations, separatorVariants } from "@/+css/separator.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithoutRef } from "react"

const $orientation = resolve(separatorOrientations)
const $variant = resolve(separatorVariants)

export type SeparatorProps = ComponentPropsWithoutRef<"hr"> & {
  orientation?: typeof $orientation.infer
  variant?: typeof $variant.infer
}

export function Separator({
  className,
  orientation = "horizontal",
  variant = "solid",
  ...props
}: SeparatorProps) {
  return (
    <hr
      {...props}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      data-orientation={orientation}
      data-slot="separator"
      data-variant={variant}
      className={cn(
        "m-0 shrink-0 border-border bg-transparent",
        $orientation(orientation),
        $variant(variant),
        className
      )}
    />
  )
}
