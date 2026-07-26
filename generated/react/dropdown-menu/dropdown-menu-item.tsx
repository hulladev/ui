import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $variant = vn({
  default:
    "text-foreground hover:bg-foreground/6 data-[highlighted=true]:bg-foreground/6 dark:hover:bg-foreground/8 dark:data-[highlighted=true]:bg-foreground/8",
  danger:
    "text-danger hover:bg-danger/10 data-[highlighted=true]:bg-danger/10 dark:hover:bg-danger/14 dark:data-[highlighted=true]:bg-danger/14",
})

export type DropdownMenuItemProps = ComponentPropsWithoutRef<"button"> & {
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
        "flex min-h-8 w-full cursor-pointer select-none items-center gap-2 rounded-none px-2 py-1.5 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 disabled:pointer-events-none disabled:opacity-45 [&_[data-slot=kbd]]:ml-auto [&_[data-slot=kbd]]:border-0 [&_[data-slot=kbd]]:bg-transparent [&_[data-slot=kbd]]:px-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        $variant(variant),
        className
      )}
    >
      {children}
    </button>
  )
}
