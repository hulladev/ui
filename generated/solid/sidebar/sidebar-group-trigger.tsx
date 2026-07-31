import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarGroupTriggerProps = JSX.IntrinsicElements["summary"]

export function SidebarGroupTrigger(props: SidebarGroupTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <summary
      {...rest}
      data-slot="sidebar-group-trigger"
      class={cn(
        "flex min-h-8 w-full list-none items-center gap-2 rounded-md px-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase transition-colors duration-150 after:ml-auto after:size-1.5 after:shrink-0 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:transition-transform after:duration-200 hover:bg-foreground/[0.045] hover:text-foreground group-open/collapsible:after:translate-y-0.5 group-open/collapsible:after:rotate-[225deg] motion-reduce:transition-none motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden",
        local.class
      )}
    >
      {local.children}
    </summary>
  )
}
