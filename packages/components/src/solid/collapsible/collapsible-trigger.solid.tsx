import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CollapsibleTriggerProps = JSX.IntrinsicElements["summary"]

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <summary
      {...rest}
      data-slot="collapsible-trigger"
      class={cn(
        "flex min-h-9 w-full list-none items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium text-foreground transition-colors duration-150 after:ml-auto after:size-2 after:shrink-0 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:transition-transform after:duration-200 hover:bg-foreground/[0.055] group-open/collapsible:after:translate-y-1 group-open/collapsible:after:rotate-[225deg] motion-reduce:transition-none motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden",
        local.class
      )}
    >
      {local.children}
    </summary>
  )
}
