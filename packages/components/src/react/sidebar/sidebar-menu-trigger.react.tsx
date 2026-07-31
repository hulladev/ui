import { sidebarMenuControls } from "@/+css/sidebar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $control = resolve(sidebarMenuControls)

export type SidebarMenuTriggerProps = ComponentPropsWithRef<"summary">

export function SidebarMenuTrigger({ children, className, ...props }: SidebarMenuTriggerProps) {
  return (
    <summary
      {...props}
      data-slot="sidebar-menu-trigger"
      className={cn(
        $control("default"),
        "list-none pr-8 after:absolute after:right-3 after:size-1.5 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:transition-transform after:duration-200 group-open/collapsible:after:translate-y-0.5 group-open/collapsible:after:rotate-[225deg] motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden",
        className
      )}
    >
      {children}
    </summary>
  )
}
