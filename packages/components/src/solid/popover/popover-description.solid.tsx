import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type PopoverDescriptionProps = JSX.IntrinsicElements["p"]

export function PopoverDescription(props: PopoverDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <p
      {...rest}
      data-slot="popover-description"
      class={cn("m-0 text-xs leading-5 text-muted-foreground", local.class)}
    >
      {local.children}
    </p>
  )
}
