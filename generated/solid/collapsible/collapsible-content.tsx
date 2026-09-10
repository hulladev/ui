import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CollapsibleContentProps = JSX.IntrinsicElements["div"]

export function CollapsibleContent(props: CollapsibleContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="collapsible-content"
      class={cn(
        "min-w-0 -translate-y-0.5 opacity-0 transition-[opacity,translate] duration-150 ease-out group-open/collapsible:translate-y-0 group-open/collapsible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
