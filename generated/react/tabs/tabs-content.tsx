import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TabsContentProps = ComponentPropsWithRef<"div"> & {
  value: string
}

export function TabsContent({
  children,
  className,
  role = "tabpanel",
  tabIndex = 0,
  value,
  ...props
}: TabsContentProps) {
  return (
    <div
      {...props}
      role={role}
      tabIndex={tabIndex}
      hidden
      data-slot="tabs-content"
      data-value={value}
      className={cn(
        "min-w-0 rounded-sm transition-opacity duration-120 ease-out starting:opacity-0 motion-reduce:transition-none text-sm leading-6 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        className
      )}
    >
      {children}
    </div>
  )
}
