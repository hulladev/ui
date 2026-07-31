import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type AlertIconProps = JSX.IntrinsicElements["span"]

export function AlertIcon(props: AlertIconProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <span
      {...rest}
      aria-hidden="true"
      data-slot="alert-icon"
      class={cn(
        "pointer-events-none absolute top-[0.9375rem] left-4 inline-flex size-[1.125rem] items-center justify-center text-[var(--alert-accent)] [&>svg]:size-full",
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
