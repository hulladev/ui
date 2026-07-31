import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CardContentProps = JSX.IntrinsicElements["div"]

export function CardContent(props: CardContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div {...rest} data-slot="card-content" class={cn("min-w-0", local.class)}>
      {local.children}
    </div>
  )
}
