import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type AccordionProps = JSX.IntrinsicElements["div"]

export function Accordion(props: AccordionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div {...rest} data-slot="accordion" class={cn("w-full border-y border-border", local.class)}>
      {local.children}
    </div>
  )
}
