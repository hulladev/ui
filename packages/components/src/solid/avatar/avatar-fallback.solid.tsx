import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type AvatarFallbackProps = JSX.IntrinsicElements["span"]

export function AvatarFallback(props: AvatarFallbackProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <span
      {...rest}
      aria-hidden="true"
      data-slot="avatar-fallback"
      class={cn(
        "flex size-full select-none items-center justify-center bg-foreground/5 font-medium tracking-[-0.02em] uppercase",
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
