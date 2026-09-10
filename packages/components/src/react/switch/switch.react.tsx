import { switchVariants } from "@/+css/switch.css"
import { resolve } from "@hulla/ui"
import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $variant = resolve(switchVariants)

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
