import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type RadioProps = Omit<ComponentPropsWithRef<"input">, "type">

export function Radio({ className, ...props }: RadioProps) {
  return (
    <input
      {...props}
      type="radio"
      data-slot="radio"
      className={cn(
        "relative inline-grid size-[1.125rem] shrink-0 appearance-none place-content-center rounded-full border border-border bg-surface align-middle shadow-xs transition-[background-color,border-color,box-shadow] duration-150 ease-out before:size-1.5 before:scale-50 before:rounded-full before:bg-primary-foreground before:opacity-0 before:transition-[opacity,scale] before:duration-100 before:ease-out before:content-[''] enabled:checked:border-primary enabled:checked:bg-primary checked:before:scale-100 checked:before:opacity-100 enabled:not-aria-invalid:hover:border-foreground/40 enabled:checked:not-aria-invalid:hover:border-primary enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-foreground))] dark:enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-background))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled-surface disabled:checked:border-disabled-foreground disabled:checked:bg-disabled-foreground disabled:before:shadow-none disabled:shadow-none motion-reduce:transition-none motion-reduce:before:transition-none dark:enabled:bg-foreground/[0.1] enabled:dark:checked:bg-primary enabled:aria-invalid:border-danger enabled:aria-invalid:checked:bg-danger aria-invalid:focus-visible:outline-danger enabled:dark:aria-invalid:checked:bg-danger",
        className
      )}
    />
  )
}
