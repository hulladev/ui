import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CardTitleProps = JSX.IntrinsicElements["h3"]

export function CardTitle(props: CardTitleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <h3
      {...rest}
      data-slot="card-title"
      class={cn("text-lg font-semibold leading-6 tracking-[-0.025em]", local.class)}
    >
      {local.children}
    </h3>
  )
}
