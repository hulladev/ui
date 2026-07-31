import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $variant = vn({
  note: "[--alert-accent:var(--color-muted-foreground)]",
  success: "[--alert-accent:var(--color-success)]",
  important: "[--alert-accent:var(--color-primary)]",
  warning: "[--alert-accent:var(--color-warning)]",
  danger: "[--alert-accent:var(--color-danger)]",
})

export type AlertProps = JSX.IntrinsicElements["div"] & {
  variant?: typeof $variant.infer
}

export function Alert(props: AlertProps) {
  const [local, rest] = splitProps(mergeProps({ role: "note", variant: "note" } as const, props), [
    "children",
    "class",
    "role",
    "variant",
  ])

  return (
    <div
      {...rest}
      role={local.role}
      data-slot="alert"
      data-variant={local.variant}
      class={cn(
        "relative min-w-0 rounded-md border border-[color-mix(in_oklab,var(--alert-accent)_16%,var(--color-border))] bg-[color-mix(in_oklab,var(--alert-accent)_3%,var(--color-surface))] px-4 py-3.5 text-sm leading-5 text-foreground [&:has(>[data-slot=alert-icon])]:pl-11 [&_a]:font-medium [&_a]:decoration-current/35 [&_a]:underline [&_a]:underline-offset-4 [&_code]:font-mono [&_code]:text-[0.8125em]",
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
