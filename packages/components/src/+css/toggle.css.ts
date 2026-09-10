import { vn } from "@/lib/style"

export const toggleVariants = vn({
  outline:
    "border-foreground/20 bg-transparent text-foreground shadow-none enabled:hover:border-foreground/40 enabled:hover:bg-foreground/[0.08] enabled:aria-pressed:border-primary/60 enabled:aria-pressed:bg-selected-surface enabled:aria-pressed:hover:bg-selected-hover-surface enabled:aria-pressed:text-primary-text",
  ghost:
    "border-transparent bg-transparent text-muted-foreground shadow-none enabled:hover:bg-foreground/[0.08] enabled:hover:text-foreground enabled:aria-pressed:bg-selected-surface enabled:aria-pressed:hover:bg-selected-hover-surface enabled:aria-pressed:text-primary-text",
  inverted:
    "border-foreground/20 bg-transparent text-foreground shadow-none enabled:hover:border-foreground/40 enabled:hover:bg-foreground/[0.08] enabled:aria-pressed:border-foreground enabled:aria-pressed:bg-foreground enabled:aria-pressed:text-background enabled:aria-pressed:hover:border-foreground/80 enabled:aria-pressed:hover:bg-foreground/80",
})

export const toggleSizes = vn({
  sm: "h-7 gap-1.5 rounded-[6px] px-2.5 text-xs [&>svg]:size-3.5",
  md: "h-8 gap-1.5 rounded-[7px] px-3 text-sm [&>svg]:size-4",
  lg: "h-9 gap-2 rounded-[8px] px-3 text-base [&>svg]:size-4.5",
})
