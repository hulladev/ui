import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type KbdProps = JSX.IntrinsicElements["kbd"]

export function Kbd(props: KbdProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <kbd
      {...rest}
      data-slot="kbd"
      class={cn(
        "inline-flex min-h-5 min-w-5 shrink-0 select-none items-center justify-center whitespace-nowrap rounded-sm border border-border bg-surface-raised px-1.5 py-0.5 align-middle font-mono text-xs font-medium leading-none text-muted-foreground shadow-[0_1px_0_var(--color-border)]",
        local.class
      )}
    >
      {local.children}
    </kbd>
  )
}
