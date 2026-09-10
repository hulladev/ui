import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type AccordionItemProps = JSX.IntrinsicElements["details"]

export function AccordionItem(props: AccordionItemProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <details
      {...rest}
      data-slot="accordion-item"
      class={cn(
        "group/accordion-item border-t border-border first:border-t-0 [interpolate-size:allow-keywords] [&::details-content]:overflow-hidden [&::details-content]:[block-size:0] [&::details-content]:transition-[block-size,content-visibility] [&::details-content]:duration-180 [&::details-content]:ease-[cubic-bezier(0.22,1,0.36,1)] [&::details-content]:[transition-behavior:allow-discrete] open:[&::details-content]:[block-size:auto] motion-reduce:[&::details-content]:transition-none",
        local.class
      )}
    >
      {local.children}
    </details>
  )
}
