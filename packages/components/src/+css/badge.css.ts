import { vn } from "@/lib/style"

export const badgeVariants = vn({
  neutral: "border-transparent bg-foreground/10 text-foreground dark:bg-foreground/15",
  primary:
    "border-transparent bg-primary text-primary-foreground dark:bg-primary/15 dark:text-primary-text",
  success: "border-transparent bg-success text-on-emphasis dark:bg-success/15 dark:text-success",
  warning: "border-transparent bg-warning text-foreground dark:bg-warning/15 dark:text-warning",
  danger: "border-transparent bg-danger text-on-emphasis dark:bg-danger/15 dark:text-danger",
})

export const badgeSizes = vn({
  sm: "h-5 gap-1.5 px-1.5 text-xs [&>svg]:size-3",
  md: "h-6 gap-1.5 px-2 text-[0.8125rem] [&>svg]:size-3.5",
  lg: "h-7 gap-2 px-2.5 text-sm [&>svg]:size-4",
})
