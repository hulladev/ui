import { dropdownMenuItemVariants } from "@/+css/dropdown-menu.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $variant = resolve(dropdownMenuItemVariants)

export type DropdownMenuItemProps = ComponentPropsWithRef<"button"> & {
  variant?: typeof $variant.infer
}

export function DropdownMenuItem({
  children,
  className,
  role = "menuitem",
  tabIndex = -1,
  type = "button",
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <button
      {...props}
      role={role}
      tabIndex={tabIndex}
      type={type}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        "flex min-h-8 w-full cursor-pointer select-none items-center gap-2 rounded-none px-3 py-2 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 disabled:cursor-not-allowed disabled:text-disabled-foreground [&_[data-slot=kbd]]:ml-auto [&_[data-slot=kbd]]:border-0 [&_[data-slot=kbd]]:bg-transparent [&_[data-slot=kbd]]:px-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        $variant(variant),
        className
      )}
    >
      {children}
    </button>
  )
}
