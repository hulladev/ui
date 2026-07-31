import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CardHeaderProps = JSX.IntrinsicElements["header"]

export function CardHeader(props: CardHeaderProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <header {...rest} data-slot="card-header" class={cn("grid gap-1.5", local.class)}>
      {local.children}
    </header>
  )
}
