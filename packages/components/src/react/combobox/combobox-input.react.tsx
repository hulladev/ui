import { formControlSizes, formControlVariants } from "@/+css/form-control.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $size = resolve(formControlSizes)
const $variant = resolve(formControlVariants)

export type ComboboxInputProps = Omit<
  ComponentPropsWithRef<"input">,
  "defaultValue" | "form" | "name" | "required" | "value"
> & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function ComboboxInput({
  autoComplete = "off",
  className,
  controlSize = "md",
  disabled = false,
  role = "combobox",
  spellCheck = false,
  type = "search",
  variant = "outline",
  ...props
}: ComboboxInputProps) {
  return (
    <input
      {...props}
      aria-autocomplete="list"
      aria-expanded="false"
      autoComplete={autoComplete}
      disabled={disabled}
      role={role}
      spellCheck={spellCheck}
      type={type}
      data-control=""
      data-disabled={disabled ? "true" : "false"}
      data-slot="combobox-input"
      className={cn(
        "block w-full min-w-0 appearance-none text-foreground antialiased caret-primary placeholder:text-muted-foreground transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground [&::-webkit-search-cancel-button]:hidden",
        $size(controlSize),
        $variant(variant),
        className
      )}
    />
  )
}
