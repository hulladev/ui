import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TabsListProps = ComponentPropsWithRef<"div">

export function TabsList({ children, className, role = "tablist", ...props }: TabsListProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="tabs-list"
      className={cn(
        "group/tabs-list relative flex w-full min-w-0 items-end gap-1 overflow-x-auto border-b border-border px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden data-[orientation=vertical]:w-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:overflow-visible data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:px-0 data-[orientation=vertical]:py-1",
        className
      )}
    >
      {children}
    </div>
  )
}
