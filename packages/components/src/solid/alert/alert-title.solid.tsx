import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type AlertTitleProps = JSX.IntrinsicElements["strong"]

export function AlertTitle(props: AlertTitleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <strong
      {...rest}
      data-slot="alert-title"
      class={cn("block font-semibold tracking-[-0.01em]", local.class)}
    >
      {local.children}
    </strong>
  )
}
