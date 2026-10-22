import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { connectCollapsible } from "@/lib/collapsible"
import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CollapsibleProps = JSX.IntrinsicElements["details"]

export function Collapsible(props: CollapsibleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  const elementRef = createMutableRef<HTMLDetailsElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDetailsElement, [])

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return
    const controller = connectCollapsible(element)
    return () => controller.destroy()
  })

  return (
    <details
      {...rest}
      ref={elementRef}
      data-slot="collapsible"
      class={cn(
        "group/collapsible min-w-0 [interpolate-size:allow-keywords] [&::details-content]:overflow-hidden [&::details-content]:[block-size:0] [&::details-content]:transition-[block-size,content-visibility] [&::details-content]:duration-180 [&::details-content]:ease-[cubic-bezier(0.22,1,0.36,1)] [&::details-content]:[transition-behavior:allow-discrete] open:[&::details-content]:[block-size:auto] motion-reduce:[&::details-content]:transition-none [&:not([data-collapsible-animating])::details-content]:transition-none [&:not([data-collapsible-animating])>summary::after]:transition-none [&:not([data-collapsible-animating])>[data-slot=collapsible-content]]:transition-none",
        local.class
      )}
    >
      {local.children}
    </details>
  )
}
