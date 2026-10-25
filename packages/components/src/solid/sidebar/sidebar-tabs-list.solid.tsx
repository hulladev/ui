import { splitProps } from "solid-js"
import { cn } from "@/lib/style"
import { TabsList, type TabsListProps } from "../tabs/tabs-list.solid"

export type SidebarTabsListProps = TabsListProps

export function SidebarTabsList(props: SidebarTabsListProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <TabsList
      {...rest}
      class={cn(
        "shrink-0 [&]:gap-0 [&]:px-0 [&>[data-slot=tabs-trigger]]:min-w-0 [&>[data-slot=tabs-trigger]]:flex-1 [&>[data-slot=tabs-trigger]]:rounded-none [&>[data-slot=tabs-trigger]]:px-2",
        local.class
      )}
    >
      {local.children}
    </TabsList>
  )
}
