import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CommandSeparatorProps = JSX.IntrinsicElements["hr"]

export function CommandSeparator(props: CommandSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <hr
      {...rest}
      data-slot="command-separator"
      class={cn("-mx-1 my-1 h-px border-0 bg-border", local.class)}
    />
  )
}
