import { vn } from "@/lib/style"

export const badgeVariants = vn({
  neutral: "border-border bg-foreground/5 text-muted-foreground",
  primary:
    "border-primary/25 bg-primary/10 text-[color-mix(in_oklab,var(--color-primary)_68%,var(--color-foreground))]",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
})

export const badgeSizes = vn({
  sm: "h-5 gap-1 rounded-sm px-1.5 text-[0.6875rem] [&>svg]:size-3",
  md: "h-6 gap-1.5 rounded-sm px-2 text-xs [&>svg]:size-3.5",
  lg: "h-7 gap-1.5 rounded-sm px-2.5 text-[0.8125rem] [&>svg]:size-4",
})
