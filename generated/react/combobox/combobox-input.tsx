import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $size = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] [&[type=file]]:leading-[1.875rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm [&[type=file]]:leading-[2.375rem] file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base [&[type=file]]:leading-[2.875rem] file:text-base",
})
const $variant = vn({
  outline:
    "border border-border bg-surface shadow-xs hover:border-foreground/25 focus-visible:border-primary aria-invalid:border-danger aria-invalid:hover:border-danger",
  filled:
    "border border-transparent bg-foreground/[0.055] shadow-none hover:bg-foreground/[0.075] focus-visible:border-primary/55 focus-visible:bg-surface aria-invalid:border-danger/65 aria-invalid:bg-danger/[0.055]",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none hover:border-foreground/35 focus-visible:border-primary aria-invalid:border-danger",
})

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
        "block w-full min-w-0 appearance-none text-foreground antialiased caret-primary placeholder:text-muted-foreground/65 transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 [&::-webkit-search-cancel-button]:hidden",
        $size(controlSize),
        $variant(variant),
        className
      )}
    />
  )
}
