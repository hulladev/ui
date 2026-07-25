import { vn } from "@/lib/style"

export const inputVariants = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-visible:border-primary aria-invalid:border-danger aria-invalid:hover:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-visible:border-primary/55 focus-visible:bg-surface aria-invalid:border-danger/65 aria-invalid:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none hover:border-foreground/35 focus-visible:border-primary aria-invalid:border-danger",
})

export const inputControlSizes = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base file:text-base",
})
