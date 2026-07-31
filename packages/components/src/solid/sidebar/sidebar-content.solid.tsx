import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarContentProps = JSX.IntrinsicElements["nav"]

export function SidebarContent(props: SidebarContentProps) {
  const [local, rest] = splitProps(
    mergeProps({ "aria-label": "Sidebar navigation" } as const, props),
    ["aria-label", "children", "class"]
  )

  return (
    <nav
      {...rest}
      aria-label={local["aria-label"]}
      data-slot="sidebar-content"
      class={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]",
        local.class
      )}
    >
      {local.children}
    </nav>
  )
}
