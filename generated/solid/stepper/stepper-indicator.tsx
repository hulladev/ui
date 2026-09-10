import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperIndicatorProps = JSX.IntrinsicElements["span"]

export function StepperIndicator(props: StepperIndicatorProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="stepper-indicator"
      class={cn(
        "relative inline-flex h-4 min-w-4 shrink-0 items-center justify-start font-mono text-[0.6875rem] leading-4 font-medium tabular-nums text-muted-foreground group-data-[state=current]/step:text-foreground",
        local.class
      )}
    >
      <span class="group-data-[state=complete]/step:opacity-0">{local.children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        class="absolute size-4 opacity-0 group-data-[state=complete]/step:opacity-100"
      >
        <path
          d="m4.5 10 3.5 3.5 7.5-7.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  )
}
