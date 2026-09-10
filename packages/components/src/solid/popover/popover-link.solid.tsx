import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type PopoverLinkProps = JSX.IntrinsicElements["a"]

export function PopoverLink(props: PopoverLinkProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <a
      {...rest}
      data-slot="popover-link"
      class={cn(
        "flex w-full items-center justify-between gap-3 rounded-sm px-2.5 py-2 text-left text-xs text-foreground no-underline hover:bg-hover-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        local.class
      )}
    >
      {local.children}
    </a>
  )
}
