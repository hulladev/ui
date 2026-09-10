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
        "relative inline-grid size-[1.125rem] shrink-0 appearance-none place-content-center rounded-[0.3125rem] border border-border bg-surface align-middle shadow-xs transition-[background-color,border-color,box-shadow] duration-90 ease-out before:h-2 before:w-[0.3125rem] before:-translate-y-px before:rotate-45 before:border-r-2 before:border-b-2 before:border-primary-foreground before:opacity-0 before:scale-75 before:transition-[opacity,scale] before:duration-75 before:ease-out before:content-[''] after:absolute after:top-1/2 after:left-1/2 after:h-0.5 after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primary-foreground after:opacity-0 after:transition-opacity after:duration-75 after:ease-out after:content-[''] enabled:checked:border-primary enabled:checked:bg-primary checked:before:opacity-100 checked:before:scale-100 enabled:indeterminate:border-primary enabled:indeterminate:bg-primary indeterminate:before:opacity-0 indeterminate:before:scale-75 indeterminate:after:opacity-100 enabled:not-aria-invalid:hover:border-foreground/40 enabled:checked:not-aria-invalid:hover:border-primary enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-foreground))] dark:enabled:checked:not-aria-invalid:hover:bg-[color-mix(in_oklab,var(--color-primary)_84%,var(--color-background))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled-surface disabled:checked:border-disabled-foreground disabled:checked:bg-disabled-foreground disabled:before:shadow-none disabled:indeterminate:border-disabled-foreground disabled:indeterminate:bg-disabled-foreground disabled:shadow-none motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:after:transition-none dark:enabled:bg-foreground/[0.1] enabled:dark:checked:bg-primary enabled:dark:indeterminate:bg-primary enabled:aria-invalid:border-danger enabled:aria-invalid:checked:bg-danger enabled:aria-invalid:indeterminate:bg-danger aria-invalid:focus-visible:outline-danger enabled:dark:aria-invalid:checked:bg-danger enabled:dark:aria-invalid:indeterminate:bg-danger",
        local.class
      )}
    />
  )
}
