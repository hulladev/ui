import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarGroupLabelProps = JSX.IntrinsicElements["div"]

export function SidebarGroupLabel(props: SidebarGroupLabelProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="sidebar-group-label"
      class={cn(
        "flex min-h-8 min-w-0 items-center px-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
