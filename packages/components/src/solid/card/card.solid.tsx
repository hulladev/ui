import { mergeProps, splitProps, type JSX } from "solid-js"
import { cardVariants } from "@/+css/card.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $variant = resolve(cardVariants)

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
