import { vn } from "@/lib/style"

export const formControlVariants = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-visible:border-primary aria-invalid:border-danger aria-invalid:hover:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-visible:border-primary/55 focus-visible:bg-surface aria-invalid:border-danger/65 aria-invalid:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none hover:border-foreground/35 focus-visible:border-primary aria-invalid:border-danger",
})

export const formControlSizes = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] [&[type=file]]:leading-[1.875rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm [&[type=file]]:leading-[2.375rem] file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base [&[type=file]]:leading-[2.875rem] file:text-base",
})

export const formControlGroupVariants = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-within:border-primary has-[[data-control][aria-invalid=true]]:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-within:border-primary/55 focus-within:bg-surface has-[[data-control][aria-invalid=true]]:border-danger/65 has-[[data-control][aria-invalid=true]]:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent shadow-none hover:border-foreground/35 focus-within:border-primary has-[[data-control][aria-invalid=true]]:border-danger",
})

export const formControlGroupSizes = vn({
  sm: "h-8 rounded-sm text-[0.8125rem] [&>[data-slot=input-adornment]]:px-2.5 [&>[data-control]]:px-2.5",
  md: "h-10 rounded-md text-sm [&>[data-slot=input-adornment]]:px-3 [&>[data-control]]:px-3",
  lg: "h-12 rounded-md text-base [&>[data-slot=input-adornment]]:px-3.5 [&>[data-control]]:px-3.5",
})
