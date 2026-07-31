import { mergeProps, splitProps, type JSX } from "solid-js"
import {
  separatorContentLineOrientations,
  separatorContentOrientations,
  separatorOrientations,
  separatorVariants,
} from "@/+css/separator.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $contentLineOrientation = resolve(separatorContentLineOrientations)
const $contentOrientation = resolve(separatorContentOrientations)
const $orientation = resolve(separatorOrientations)
const $variant = resolve(separatorVariants)

export type SeparatorProps = Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> & {
  orientation?: typeof $orientation.infer
  ref?: (element: HTMLDivElement | HTMLHRElement) => void
  variant?: typeof $variant.infer
}

export function Separator(props: SeparatorProps) {
  const [local, rest] = splitProps(
    mergeProps({ orientation: "horizontal", variant: "solid" } as const, props),
    ["children", "class", "orientation", "ref", "variant"]
  )

  if (local.children !== undefined && local.children !== null && local.children !== false) {
    return (
      <div
        {...rest}
        ref={(element) => local.ref?.(element)}
        role="separator"
        aria-orientation={local.orientation === "vertical" ? "vertical" : undefined}
        data-orientation={local.orientation}
        data-slot="separator"
        data-variant={local.variant}
        class={cn(
          "m-0 flex shrink-0 items-center justify-center text-xs font-medium leading-none text-muted-foreground",
          $contentOrientation(local.orientation),
          local.class
        )}
      >
        <span
          aria-hidden="true"
          data-slot="separator-line"
          class={cn(
            "shrink-0 border-border",
            $contentLineOrientation(local.orientation),
            $variant(local.variant)
          )}
        />
        <span data-slot="separator-content" class="shrink-0">
          {local.children}
        </span>
        <span
          aria-hidden="true"
          data-slot="separator-line"
          class={cn(
            "shrink-0 border-border",
            $contentLineOrientation(local.orientation),
            $variant(local.variant)
          )}
        />
      </div>
    )
  }

  return (
    <hr
      {...rest}
      ref={(element) => local.ref?.(element)}
      aria-orientation={local.orientation === "vertical" ? "vertical" : undefined}
      data-orientation={local.orientation}
      data-slot="separator"
      data-variant={local.variant}
      class={cn(
        "m-0 shrink-0 border-border bg-transparent",
        $orientation(local.orientation),
        $variant(local.variant),
        local.class
      )}
    />
  )
}
