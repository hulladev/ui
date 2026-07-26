import { vn } from "@/lib/style"

export const buttonVariants = vn({
  primary:
    "border-primary bg-primary text-primary-foreground hover:border-primary/90 hover:bg-primary/90",
  secondary:
    "border-foreground bg-foreground text-background hover:border-foreground/85 hover:bg-foreground/85",
  outline:
    "border-border bg-transparent text-foreground hover:border-foreground/25 hover:bg-foreground/5 active:bg-foreground/10",
})

export const buttonSizes = vn({
  sm: "gap-1.5 rounded-sm px-2 py-1.5 text-[0.8125rem]",
  md: "gap-1.5 rounded-sm px-3 py-2 text-sm",
  lg: "gap-2 rounded-md px-3.5 py-2 text-base",
})
