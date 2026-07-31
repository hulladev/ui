import { vn } from "@/lib/style"

export const toggleVariants = vn({
  default:
    "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-foreground/[0.05] hover:text-foreground aria-pressed:text-primary aria-pressed:[&_svg]:fill-current",
  outline:
    "border-border bg-surface text-muted-foreground shadow-xs hover:border-foreground/25 hover:bg-foreground/[0.04] hover:text-foreground aria-pressed:border-primary/45 aria-pressed:text-primary aria-pressed:[&_svg]:fill-current",
})

export const toggleSizes = vn({
  sm: "min-h-7 gap-1.5 rounded-sm px-2 text-xs",
  md: "min-h-8 gap-1.5 rounded-sm px-2.5 text-[0.8125rem]",
  lg: "min-h-10 gap-2 rounded-md px-3 text-sm",
})
