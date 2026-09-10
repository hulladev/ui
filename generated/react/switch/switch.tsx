import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $variant = vn({
  default:
    "h-5 w-9 bg-foreground/[0.12] shadow-inner before:left-0.5 before:size-3.5 before:bg-surface-raised before:shadow-sm enabled:checked:border-primary enabled:checked:bg-primary checked:before:translate-x-4 enabled:not-aria-invalid:hover:border-foreground/40 enabled:checked:not-aria-invalid:hover:border-primary enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-foreground))] dark:enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-background))] disabled:checked:border-disabled-foreground disabled:checked:bg-disabled-foreground dark:enabled:bg-foreground/[0.18] dark:before:bg-foreground dark:before:shadow-[0_1px_3px_rgb(0_0_0/0.72),0_0_0_1px_rgb(255_255_255/0.1)] enabled:dark:checked:bg-primary",
  subtle:
    "h-[0.95rem] w-[1.7rem] bg-foreground/5 before:left-0.5 before:size-[0.55rem] before:bg-muted-foreground enabled:checked:border-primary enabled:checked:bg-primary/12 enabled:checked:before:bg-primary checked:before:translate-x-[0.7rem] enabled:not-aria-invalid:hover:border-foreground/40 enabled:checked:not-aria-invalid:hover:border-primary enabled:checked:not-aria-invalid:hover:bg-primary/18 disabled:before:bg-disabled-foreground",
})

export type SwitchProps = Omit<ComponentPropsWithRef<"input">, "role" | "type"> & {
  variant?: typeof $variant.infer
}

export function Switch({ className, variant = "default", ...props }: SwitchProps) {
  return (
    <input
      {...props}
      type="checkbox"
      role="switch"
      data-slot="switch"
      data-variant={variant}
      className={cn(
        "relative inline-block shrink-0 appearance-none rounded-full border border-border align-middle transition-[background-color,border-color,box-shadow] duration-200 ease-out before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-full before:transition-[translate,background-color] before:duration-200 before:ease-out before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled-surface disabled:before:shadow-none disabled:shadow-none motion-reduce:transition-none motion-reduce:before:transition-none enabled:aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
        $variant(variant),
        className
      )}
    />
  )
}
