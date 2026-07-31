import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type FieldDescriptionProps = JSX.IntrinsicElements["p"]

export function FieldDescription(props: FieldDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <p
      {...rest}
      data-slot="description"
      class={cn("text-[0.8125rem] leading-5 text-muted-foreground", local.class)}
    >
      {local.children}
    </p>
  )
}
