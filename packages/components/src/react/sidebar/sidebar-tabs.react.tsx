import { cn } from "@/lib/style"
import { Tabs, type TabsProps } from "../tabs/tabs.react"

export type SidebarTabsProps = Omit<TabsProps, "orientation">

export function SidebarTabs({ children, className, ...props }: SidebarTabsProps) {
  return (
    <Tabs {...props} className={cn("[&]:flex min-h-0 flex-1 flex-col [&]:gap-0", className)}>
      {children}
    </Tabs>
  )
}
