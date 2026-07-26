import { vn } from "@/lib/style"

export const alertVariants = vn({
  note: "[--alert-accent:var(--color-muted-foreground)]",
  success: "[--alert-accent:var(--color-success)]",
  important: "[--alert-accent:var(--color-primary)]",
  warning: "[--alert-accent:var(--color-warning)]",
  danger: "[--alert-accent:var(--color-danger)]",
})
