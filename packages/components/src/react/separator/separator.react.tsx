import {
  separatorContentLineOrientations,
  separatorContentOrientations,
  separatorOrientations,
  separatorVariants,
} from "@/+css/separator.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $contentLineOrientation = resolve(separatorContentLineOrientations)
const $contentOrientation = resolve(separatorContentOrientations)
const $orientation = resolve(separatorOrientations)
const $variant = resolve(separatorVariants)

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
