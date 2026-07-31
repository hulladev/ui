import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $contentLineOrientation = vn({
  horizontal: "h-0 w-full flex-1 border-x-0 border-b-0 border-t",
  vertical: "h-full min-h-4 w-0 flex-1 border-y-0 border-r-0 border-l",
})
const $contentOrientation = vn({
  horizontal: "w-full flex-row gap-3",
  vertical: "h-auto min-h-4 self-stretch flex-col gap-2",
})
const $orientation = vn({
  horizontal: "h-0 w-full border-x-0 border-b-0 border-t",
  vertical: "h-auto min-h-4 w-0 self-stretch border-y-0 border-r-0 border-l",
})
const $variant = vn({
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
})

export type SeparatorProps = ComponentPropsWithRef<"hr"> & {
  orientation?: typeof $orientation.infer
  variant?: typeof $variant.infer
}

export function Separator({
  children,
  className,
  orientation = "horizontal",
  variant = "solid",
  ...props
}: SeparatorProps) {
  if (children !== undefined && children !== null && children !== false) {
    return (
      <div
        {...props}
        role="separator"
        aria-orientation={orientation === "vertical" ? "vertical" : undefined}
        data-orientation={orientation}
        data-slot="separator"
        data-variant={variant}
        className={cn(
          "m-0 flex shrink-0 items-center justify-center text-xs font-medium leading-none text-muted-foreground",
          $contentOrientation(orientation),
          className
        )}
      >
        <span
          aria-hidden="true"
          data-slot="separator-line"
          className={cn(
            "shrink-0 border-border",
            $contentLineOrientation(orientation),
            $variant(variant)
          )}
        />
        <span data-slot="separator-content" className="shrink-0">
          {children}
        </span>
        <span
          aria-hidden="true"
          data-slot="separator-line"
          className={cn(
            "shrink-0 border-border",
            $contentLineOrientation(orientation),
            $variant(variant)
          )}
        />
      </div>
    )
  }

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
