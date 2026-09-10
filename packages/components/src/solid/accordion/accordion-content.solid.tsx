import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type AccordionContentProps = JSX.IntrinsicElements["div"]

export function AccordionContent(props: AccordionContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="accordion-content"
      class={cn(
        "min-w-0 translate-y-1 pb-5 pr-10 text-sm leading-6 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 ease-out group-open/accordion-item:translate-y-0 group-open/accordion-item:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none [&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-current/30 [&_a]:underline-offset-4 [&_p]:my-0 [&_p+_p]:mt-3",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
