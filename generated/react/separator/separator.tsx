import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $orientation = vn({
  horizontal: "h-0 w-full border-x-0 border-b-0 border-t",
  vertical: "h-auto min-h-4 w-0 self-stretch border-y-0 border-r-0 border-l",
})
const $variant = vn({
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
})

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
