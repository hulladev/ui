import { mergeProps, splitProps, type JSX } from "solid-js"
import { formControlSizes, formControlVariants } from "@/+css/form-control.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(formControlSizes)
const $variant = resolve(formControlVariants)

export type ComboboxInputProps = Omit<
  JSX.IntrinsicElements["input"],
  "defaultValue" | "form" | "name" | "required" | "value"
> & {
  controlSize?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function ComboboxInput(props: ComboboxInputProps) {
  const [local, rest] = splitProps(
    mergeProps(
      {
        autoComplete: "off",
        controlSize: "md",
        disabled: false,
        role: "combobox",
        spellCheck: false,
        type: "search",
        variant: "outline",
      } as const,
      props
    ),
    ["autoComplete", "class", "controlSize", "disabled", "role", "spellCheck", "type", "variant"]
  )

  return (
    <input
      {...rest}
      aria-autocomplete="list"
      aria-expanded="false"
      autocomplete={local.autoComplete}
      disabled={local.disabled}
      role={local.role}
      spellcheck={local.spellCheck}
      type={local.type}
      data-control=""
      data-disabled={local.disabled ? "true" : "false"}
      data-slot="combobox-input"
      class={cn(
        "block w-full min-w-0 appearance-none text-foreground antialiased caret-primary placeholder:text-muted-foreground/65 transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55 [&::-webkit-search-cancel-button]:hidden",
        $size(local.controlSize),
        $variant(local.variant),
        local.class
      )}
    />
  )
}
