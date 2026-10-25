import { splitProps } from "solid-js"
import { cn } from "@/lib/style"
import { Tabs, type TabsProps } from "../tabs/tabs.solid"

export type SidebarTabsProps = Omit<TabsProps, "orientation">

export function SidebarTabs(props: SidebarTabsProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <Tabs {...rest} class={cn("[&]:flex min-h-0 flex-1 flex-col [&]:gap-0", local.class)}>
      {local.children}
    </Tabs>
  )
}
