import { vn } from "@/lib/style"

export const dropdownMenuItemVariants = vn({
  default:
    "text-foreground hover:bg-foreground/6 data-[highlighted=true]:bg-foreground/6 dark:hover:bg-foreground/8 dark:data-[highlighted=true]:bg-foreground/8",
  danger:
    "text-danger hover:bg-danger/10 data-[highlighted=true]:bg-danger/10 dark:hover:bg-danger/14 dark:data-[highlighted=true]:bg-danger/14",
})
