import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CardFooterProps = JSX.IntrinsicElements["footer"]

export function CardFooter(props: CardFooterProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <footer
      {...rest}
      data-slot="card-footer"
      class={cn(
        "mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-5",
        local.class
      )}
    >
      {local.children}
    </footer>
  )
}
