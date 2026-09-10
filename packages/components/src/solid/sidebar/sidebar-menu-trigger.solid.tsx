import { interactiveRow } from "@/+css/interactive-row.css"
import { splitProps, type JSX } from "solid-js"
import { sidebarMenuControls } from "@/+css/sidebar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $control = resolve(sidebarMenuControls)
const $interactiveRow = resolve(interactiveRow)

export type SidebarMenuTriggerProps = JSX.IntrinsicElements["summary"]

export function SidebarMenuTrigger(props: SidebarMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <summary
      {...rest}
      data-slot="sidebar-menu-trigger"
      class={cn(
        $control("default"),
        $interactiveRow("default"),
        "list-none pr-8 after:absolute after:right-3 after:size-1.5 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:transition-transform after:duration-200 group-open/collapsible:after:translate-y-0.5 group-open/collapsible:after:rotate-[225deg] motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden",
        local.class
      )}
    >
      {local.children}
    </summary>
  )
}
