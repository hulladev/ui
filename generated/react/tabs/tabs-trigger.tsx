import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type TabsTriggerProps = ComponentPropsWithRef<"button"> & {
  value: string
}

export function TabsTrigger({
  children,
  className,
  role = "tab",
  type = "button",
  value,
  ...props
}: TabsTriggerProps) {
  return (
    <button
      {...props}
      type={type}
      role={role}
      value={value}
      aria-selected="false"
      tabIndex={-1}
      data-slot="tabs-trigger"
      data-value={value}
      className={cn(
        "relative inline-flex min-h-10 flex-none select-none items-center justify-center gap-2 whitespace-nowrap rounded-t-sm border-0 bg-transparent px-3 py-2 text-sm font-medium leading-none tracking-[-0.01em] text-muted-foreground transition-[background-color,color] duration-150 after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-primary after:opacity-0 after:transition-[transform,opacity] after:duration-200 after:ease-out after:content-[''] hover:bg-foreground/[0.045] hover:text-foreground focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring data-[state=active]:bg-foreground/[0.035] data-[state=active]:text-foreground data-[state=active]:after:scale-x-100 data-[state=active]:after:opacity-100 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:after:transition-none group-data-[orientation=vertical]/tabs-list:w-full group-data-[orientation=vertical]/tabs-list:justify-start group-data-[orientation=vertical]/tabs-list:rounded-r-none group-data-[orientation=vertical]/tabs-list:rounded-l-sm group-data-[orientation=vertical]/tabs-list:after:inset-y-2 group-data-[orientation=vertical]/tabs-list:after:right-[-1px] group-data-[orientation=vertical]/tabs-list:after:left-auto group-data-[orientation=vertical]/tabs-list:after:h-auto group-data-[orientation=vertical]/tabs-list:after:w-0.5 group-data-[orientation=vertical]/tabs-list:after:scale-x-100 group-data-[orientation=vertical]/tabs-list:after:scale-y-0 group-data-[orientation=vertical]/tabs-list:data-[state=active]:after:scale-y-100",
        className
      )}
    >
      {children}
    </button>
  )
}
