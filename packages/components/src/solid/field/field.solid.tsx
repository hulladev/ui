import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type FieldProps = Omit<JSX.IntrinsicElements["div"], "children"> & {
  children: JSX.Element
}

export function Field(props: FieldProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="field"
      class={cn(
        "group/field grid min-w-0 gap-1.5 text-left has-[:disabled]:opacity-70",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
