import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type FieldProps = Omit<JSX.IntrinsicElements["div"], "children"> & {
  children: JSX.Element
  orientation?: "vertical" | "horizontal"
}

export function Field(props: FieldProps) {
  const [local, rest] = splitProps(props, ["children", "class", "orientation"])

  return (
    <div
      {...rest}
      data-slot="field"
      data-orientation={local.orientation ?? "vertical"}
      class={cn(
        "group/field grid min-w-0 content-start gap-1.5 text-left data-[orientation=horizontal]:grid-cols-[auto_minmax(0,1fr)] data-[orientation=horizontal]:items-start data-[orientation=horizontal]:gap-x-4",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
