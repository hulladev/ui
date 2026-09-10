import { vn } from "@/lib/style"

export const switchVariants = vn({
  default:
    "h-5 w-9 bg-foreground/[0.12] shadow-inner before:left-0.5 before:size-3.5 before:bg-surface-raised before:shadow-sm enabled:checked:border-primary enabled:checked:bg-primary checked:before:translate-x-4 enabled:not-aria-invalid:hover:border-foreground/40 enabled:checked:not-aria-invalid:hover:border-primary enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-foreground))] dark:enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-background))] disabled:checked:border-disabled-foreground disabled:checked:bg-disabled-foreground dark:enabled:bg-foreground/[0.18] dark:before:bg-foreground dark:before:shadow-[0_1px_3px_rgb(0_0_0/0.72),0_0_0_1px_rgb(255_255_255/0.1)] enabled:dark:checked:bg-primary",
  subtle:
    "h-[0.95rem] w-[1.7rem] bg-foreground/5 before:left-0.5 before:size-[0.55rem] before:bg-muted-foreground enabled:checked:border-primary enabled:checked:bg-primary/12 enabled:checked:before:bg-primary checked:before:translate-x-[0.7rem] enabled:not-aria-invalid:hover:border-foreground/40 enabled:checked:not-aria-invalid:hover:border-primary enabled:checked:not-aria-invalid:hover:bg-primary/18 disabled:before:bg-disabled-foreground",
})
