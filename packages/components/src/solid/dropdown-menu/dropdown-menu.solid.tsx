import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { popoverPlacements, popoverSurface } from "@/+css/popover.css"
import { connectDropdownMenu } from "@/lib/dropdown-menu"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $placement = resolve(popoverPlacements)
const $surface = resolve(popoverSurface)

export type DropdownMenuProps = JSX.IntrinsicElements["div"] & {
  placement?: typeof $placement.infer
}

export function DropdownMenu(props: DropdownMenuProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { placement: "bottom-start", popover: "auto", role: "menu", tabIndex: -1 } as const,
      props
    ),
    ["children", "class", "placement", "popover", "role", "tabIndex"]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDropdownMenu(element)
    return () => controller.destroy()
  })

  return (
    <div
      {...rest}
      ref={elementRef}
      popover={local.popover}
      role={local.role}
      tabindex={local.tabIndex}
      data-placement={local.placement}
      data-slot="dropdown-menu"
      class={cn(
        $surface,
        $placement(local.placement),
        "min-w-48 max-w-72 overscroll-contain p-0",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
