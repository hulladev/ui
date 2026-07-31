import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

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
