import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperLinkProps = JSX.IntrinsicElements["a"]

export function StepperLink(props: StepperLinkProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <a
      {...rest}
      data-slot="stepper-link"
      class={cn(
        "relative flex min-w-0 flex-col items-start gap-3 rounded-none pb-1 text-sm leading-5 font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring group-data-[state=current]/step:font-semibold group-data-[orientation=vertical]/stepper:flex-row group-data-[orientation=vertical]/stepper:items-start group-data-[orientation=vertical]/stepper:gap-4 motion-reduce:transition-none",
        local.class
      )}
    >
      {local.children}
    </a>
  )
}
