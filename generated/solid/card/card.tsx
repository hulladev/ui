import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $variant = vn({
  outline: "border-border bg-surface shadow-xs",
  elevated: "border-border bg-surface-raised shadow-(--shadow-raised) ",
  ghost: "border-transparent bg-transparent shadow-none",
})

export type CardProps = JSX.IntrinsicElements["article"] & {
  variant?: typeof $variant.infer
}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(mergeProps({ variant: "outline" } as const, props), [
    "children",
    "class",
    "variant",
  ])

  return (
    <article
      {...rest}
      data-slot="card"
      data-variant={local.variant}
      class={cn(
        "group/card flex min-w-0 flex-col gap-6 rounded-lg border p-6 text-foreground",
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </article>
  )
}
