import { cn } from "@/lib/style"
import { TabsList, type TabsListProps } from "../tabs/tabs-list.react"

export type SidebarTabsListProps = TabsListProps

export function SidebarTabsList({ children, className, ...props }: SidebarTabsListProps) {
  return (
    <TabsList
      {...props}
      className={cn(
        "shrink-0 [&]:gap-0 [&]:px-0 [&>[data-slot=tabs-trigger]]:min-w-0 [&>[data-slot=tabs-trigger]]:flex-1 [&>[data-slot=tabs-trigger]]:rounded-none [&>[data-slot=tabs-trigger]]:px-2",
        className
      )}
    >
      {children}
    </TabsList>
  )
}
