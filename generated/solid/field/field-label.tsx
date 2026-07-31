import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type FieldLabelProps = JSX.IntrinsicElements["label"]

export function FieldLabel(props: FieldLabelProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <label
      {...rest}
      data-slot="label"
      class={cn(
        "w-fit text-sm font-medium leading-5 tracking-[-0.01em] text-foreground group-has-[:required]/field:after:ml-1 group-has-[:required]/field:after:text-danger group-has-[:required]/field:after:content-['*'] group-has-[:disabled]/field:cursor-not-allowed",
        local.class
      )}
    >
      {local.children}
    </label>
  )
}
