import { mergeProps, splitProps, type JSX } from "solid-js"
import { popoverPlacements, popoverSurface } from "@/+css/popover.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $placement = resolve(popoverPlacements)
const $surface = resolve(popoverSurface)

export type ComboboxContentProps = JSX.IntrinsicElements["div"] & {
  placement?: typeof $placement.infer
}

export function ComboboxContent(props: ComboboxContentProps) {
  const [local, rest] = splitProps(
    mergeProps({ placement: "bottom-start", popover: "auto", role: "listbox" } as const, props),
    ["children", "class", "placement", "popover", "role"]
  )

  return (
    <div
      {...rest}
      popover={local.popover}
      role={local.role}
      data-placement={local.placement}
      data-slot="combobox-content"
      class={cn(
        $surface,
        $placement(local.placement),
        "min-w-[anchor-size(width)] max-w-[min(28rem,calc(100vw-1rem))] overscroll-contain p-0",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
