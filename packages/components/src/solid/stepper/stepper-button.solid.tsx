import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperButtonProps = JSX.IntrinsicElements["button"]

export function StepperButton(props: StepperButtonProps) {
  const [local, rest] = splitProps(props, ["children", "class", "type"])
  return (
    <button
      {...rest}
      type={local.type ?? "button"}
      data-slot="stepper-button"
      class={cn(
        "relative flex w-full min-w-0 flex-col items-start gap-3 rounded-none pb-1 text-left text-sm leading-5 font-medium transition-colors enabled:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring disabled:cursor-not-allowed group-data-[state=current]/step:font-semibold group-data-[orientation=vertical]/stepper:flex-row group-data-[orientation=vertical]/stepper:items-start group-data-[orientation=vertical]/stepper:gap-4 motion-reduce:transition-none",
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
