import { mergeProps, splitProps, type JSX } from "solid-js"
import { popoverPlacements, popoverSurface } from "@/+css/popover.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $placement = resolve(popoverPlacements)
const $surface = resolve(popoverSurface)

export type SelectContentProps = JSX.IntrinsicElements["div"] & {
  placement?: typeof $placement.infer
}

export function SelectContent(props: SelectContentProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { placement: "bottom-start", popover: "auto", role: "listbox", tabIndex: -1 } as const,
      props
    ),
    ["children", "class", "placement", "popover", "role", "tabIndex"]
  )

  return (
    <div
      {...rest}
      popover={local.popover}
      role={local.role}
      tabindex={local.tabIndex}
      data-placement={local.placement}
      data-slot="select-content"
      class={cn(
        $surface,
        $placement(local.placement),
        "min-w-[anchor-size(width)] max-w-[min(28rem,calc(100vw-1rem))] overscroll-contain p-1",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
