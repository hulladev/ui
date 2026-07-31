import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, ReactNode } from "react"

export type ButtonGroupProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  children: ReactNode
  orientation?: "horizontal" | "vertical"
}

export function ButtonGroup({
  children,
  className,
  orientation = "horizontal",
  role = "group",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      {...props}
      role={role}
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "isolate inline-flex w-fit items-stretch [&>*]:relative [&>*]:focus-visible:z-10 [&>button]:active:scale-100 data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:[&>*:not(:first-child)]:-ml-px data-[orientation=horizontal]:[&>*:not(:first-child)]:rounded-l-none data-[orientation=horizontal]:[&>*:not(:last-child)]:rounded-r-none data-[orientation=vertical]:flex-col data-[orientation=vertical]:[&>*:not(:first-child)]:-mt-px data-[orientation=vertical]:[&>*:not(:first-child)]:rounded-t-none data-[orientation=vertical]:[&>*:not(:last-child)]:rounded-b-none",
        className
      )}
    >
      {children}
    </div>
  )
}
