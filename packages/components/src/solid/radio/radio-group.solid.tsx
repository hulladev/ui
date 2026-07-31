import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type RadioGroupProps = Omit<JSX.IntrinsicElements["fieldset"], "children"> & {
  children: JSX.Element
}

export function RadioGroup(props: RadioGroupProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <fieldset
      {...rest}
      data-slot="radio-group"
      class={cn("m-0 grid min-w-0 gap-3 border-0 p-0 text-left", local.class)}
    >
      {local.children}
    </fieldset>
  )
}
