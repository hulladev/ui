import type { ComponentPropsWithoutRef } from "react"

export type DropdownMenuGroupProps = ComponentPropsWithoutRef<"div">

export function DropdownMenuGroup({
  children,
  className,
  role = "group",
  ...props
}: DropdownMenuGroupProps) {
  return (
    <div {...props} role={role} data-slot="dropdown-menu-group" className={className}>
      {children}
    </div>
  )
}
