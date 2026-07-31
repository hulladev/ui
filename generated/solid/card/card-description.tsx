import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CardDescriptionProps = JSX.IntrinsicElements["p"]

export function CardDescription(props: CardDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <p
      {...rest}
      data-slot="card-description"
      class={cn("text-sm leading-6 text-muted-foreground", local.class)}
    >
      {local.children}
    </p>
  )
}
