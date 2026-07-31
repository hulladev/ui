import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SwitchProps = Omit<ComponentPropsWithRef<"input">, "role" | "type">

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <input
      {...props}
      type="checkbox"
      role="switch"
      data-slot="switch"
      className={cn(
        "relative inline-block h-5 w-9 shrink-0 appearance-none rounded-full border border-border bg-foreground/[0.12] align-middle shadow-inner transition-[background-color,border-color,box-shadow] duration-150 ease-out before:absolute before:top-1/2 before:left-0.5 before:size-3.5 before:-translate-y-1/2 before:rounded-full before:bg-surface-raised before:shadow-sm before:transition-transform before:duration-150 before:ease-out before:content-[''] checked:border-primary checked:bg-primary checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none motion-reduce:before:transition-none dark:bg-foreground/[0.18] dark:before:bg-foreground dark:before:shadow-[0_1px_3px_rgb(0_0_0/0.72),0_0_0_1px_rgb(255_255_255/0.1)] dark:checked:bg-primary aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
        className
      )}
    />
  )
}
