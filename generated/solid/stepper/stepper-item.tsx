import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperItemProps = Omit<JSX.IntrinsicElements["li"], "aria-current"> & {
  state?: "upcoming" | "current" | "complete"
}

export function StepperItem(props: StepperItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "state"])
  return (
    <li
      {...rest}
      data-state={local.state ?? "upcoming"}
      aria-current={local.state === "current" ? "step" : undefined}
      data-slot="stepper-item"
      class={cn(
        "group/step relative min-w-0 flex-1 border-t-2 border-foreground/15 pt-4 text-muted-foreground data-[state=current]:border-foreground data-[state=current]:text-foreground data-[state=complete]:border-foreground/40 data-[state=complete]:text-foreground group-data-[orientation=vertical]/stepper:flex-none group-data-[orientation=vertical]/stepper:border-t-0 group-data-[orientation=vertical]/stepper:border-l-2 group-data-[orientation=vertical]/stepper:py-1 group-data-[orientation=vertical]/stepper:pl-5",
        local.class
      )}
    >
      {local.children}
    </li>
  )
}
