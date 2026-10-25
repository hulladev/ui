import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperPanelProps = JSX.IntrinsicElements["div"]

export function StepperPanel(props: StepperPanelProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div
      {...rest}
      data-slot="stepper-panel"
      class={cn(
        "col-start-2 grid min-w-0 gap-4 pb-8 pt-4 text-base leading-7 text-foreground group-last/step:pb-0 [&>*]:m-0",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
