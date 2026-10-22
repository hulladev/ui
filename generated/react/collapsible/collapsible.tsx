import { connectCollapsible } from "@/lib/collapsible"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type CollapsibleProps = ComponentPropsWithRef<"details">

export function Collapsible({ children, className, ...props }: CollapsibleProps) {
  const elementRef = useRef<HTMLDetailsElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDetailsElement, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    const controller = connectCollapsible(element)
    return () => controller.destroy()
  }, [])

  return (
    <details
      {...props}
      ref={elementRef}
      data-slot="collapsible"
      className={cn(
        "group/collapsible min-w-0 [interpolate-size:allow-keywords] [&::details-content]:overflow-hidden [&::details-content]:[block-size:0] [&::details-content]:transition-[block-size,content-visibility] [&::details-content]:duration-180 [&::details-content]:ease-[cubic-bezier(0.22,1,0.36,1)] [&::details-content]:[transition-behavior:allow-discrete] open:[&::details-content]:[block-size:auto] motion-reduce:[&::details-content]:transition-none [&:not([data-collapsible-animating])::details-content]:transition-none [&:not([data-collapsible-animating])>summary::after]:transition-none [&:not([data-collapsible-animating])>[data-slot=collapsible-content]]:transition-none",
        className
      )}
    >
      {children}
    </details>
  )
}
