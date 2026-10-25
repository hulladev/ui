import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type AlertDescriptionProps = JSX.IntrinsicElements["div"]

export function AlertDescription(props: AlertDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="alert-description"
      class={cn("mt-1 text-muted-foreground", local.class)}
    >
      {local.children}
    </div>
  )
}
