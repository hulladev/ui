import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CheckboxProps = Omit<JSX.IntrinsicElements["input"], "type">

export function Checkbox(props: CheckboxProps) {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <input
      {...rest}
      type="checkbox"
      data-slot="checkbox"
      class={cn(
        "relative inline-grid size-[1.125rem] shrink-0 appearance-none place-content-center rounded-[0.3125rem] border border-border bg-surface align-middle shadow-xs transition-[background-color,border-color,box-shadow] duration-150 ease-out before:h-2 before:w-[0.3125rem] before:-translate-y-px before:rotate-45 before:border-r-2 before:border-b-2 before:border-primary-foreground before:opacity-0 before:transition-opacity before:duration-100 before:content-[''] after:absolute after:top-1/2 after:left-1/2 after:h-0.5 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primary-foreground after:opacity-0 after:transition-opacity after:duration-100 after:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-100 indeterminate:border-primary indeterminate:bg-primary indeterminate:before:opacity-0 indeterminate:after:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:after:transition-none dark:bg-foreground/[0.1] dark:checked:bg-primary dark:indeterminate:bg-primary aria-invalid:border-danger aria-invalid:checked:bg-danger aria-invalid:indeterminate:bg-danger aria-invalid:focus-visible:outline-danger dark:aria-invalid:checked:bg-danger dark:aria-invalid:indeterminate:bg-danger",
        local.class
      )}
    />
  )
}
