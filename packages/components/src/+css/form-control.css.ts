import { vn } from "@/lib/style"

export const formControlVariants = vn({
  outline:
    "border border-foreground/25 bg-surface shadow-[inset_0_1px_2px_oklch(0_0_0/0.025)] enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring enabled:aria-invalid:border-danger enabled:aria-invalid:hover:border-danger disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  filled:
    "border border-transparent bg-foreground/[0.075] shadow-none enabled:not-focus-visible:not-aria-invalid:hover:bg-foreground/[0.12] focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring focus-visible:bg-surface enabled:aria-invalid:border-danger/65 enabled:aria-invalid:bg-danger/[0.055] disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:border-focus-ring focus-visible:shadow-[0_1px_0_var(--color-focus-ring)] enabled:aria-invalid:border-danger disabled:border-disabled-border disabled:bg-transparent disabled:shadow-none",
})

export const formControlSizes = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] [&[type=file]]:leading-[1.875rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm [&[type=file]]:leading-[2.375rem] file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base [&[type=file]]:leading-[2.875rem] file:text-base",
})

export const formControlGroupVariants = vn({
  outline:
    "border border-foreground/25 bg-surface shadow-[inset_0_1px_2px_oklch(0_0_0/0.025)] has-[[data-control]:enabled]:not-focus-within:not-has-[[data-control][aria-invalid=true]:enabled]:hover:border-foreground/40 focus-within:ring-2 focus-within:ring-focus-ring/25 focus-within:border-focus-ring has-[[data-control][aria-invalid=true]:enabled]:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.075] shadow-none has-[[data-control]:enabled]:not-focus-within:not-has-[[data-control][aria-invalid=true]:enabled]:hover:bg-foreground/[0.12] focus-within:ring-2 focus-within:ring-focus-ring/25 focus-within:border-focus-ring focus-within:bg-surface has-[[data-control][aria-invalid=true]:enabled]:border-danger/65 has-[[data-control][aria-invalid=true]:enabled]:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent shadow-none has-[[data-control]:enabled]:not-focus-within:not-has-[[data-control][aria-invalid=true]:enabled]:hover:border-foreground/40 focus-within:border-focus-ring focus-within:shadow-[0_1px_0_var(--color-focus-ring)] has-[[data-control][aria-invalid=true]:enabled]:border-danger",
})

export const formControlGroupSizes = vn({
  sm: "h-8 rounded-sm text-[0.8125rem] [&>[data-slot=input-adornment]]:px-2.5 [&>[data-control]]:px-2.5",
  md: "h-10 rounded-md text-sm [&>[data-slot=input-adornment]]:px-3 [&>[data-control]]:px-3",
  lg: "h-12 rounded-md text-base [&>[data-slot=input-adornment]]:px-3.5 [&>[data-control]]:px-3.5",
})
