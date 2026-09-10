import { vn } from "@/lib/style"

export const dropdownMenuItemVariants = vn({
  default:
    "text-foreground enabled:hover:bg-hover-surface enabled:data-[highlighted=true]:bg-hover-surface",
  danger:
    "text-danger enabled:hover:bg-danger/10 enabled:data-[highlighted=true]:bg-danger/10 dark:enabled:hover:bg-danger/15 dark:enabled:data-[highlighted=true]:bg-danger/15",
})
