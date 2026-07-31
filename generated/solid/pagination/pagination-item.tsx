import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type PaginationItemProps = JSX.IntrinsicElements["li"]

export function PaginationItem(props: PaginationItemProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <li
      {...rest}
      data-slot="pagination-item"
      class={cn(
        "inline-flex min-w-0 items-center *:inline-flex *:h-9 *:min-w-9 *:select-none *:items-center *:justify-center *:gap-1.5 *:rounded-md *:px-2.5 *:font-mono *:text-xs *:font-medium *:leading-none *:tabular-nums *:transition-[background-color,color,transform,box-shadow] *:duration-150 *:ease-out [&>a[href]]:hover:bg-foreground/[0.06] [&>a[href]]:active:translate-y-px [&>button:not(:disabled)]:hover:bg-foreground/[0.06] [&>button:not(:disabled)]:active:translate-y-px [&>button:disabled]:pointer-events-none [&>button:disabled]:opacity-40 [&>[aria-current=page]]:bg-foreground [&>[aria-current=page]]:font-semibold [&>[aria-current=page]]:text-background! [&>[aria-current=page]]:shadow-sm [&>[aria-disabled=true]]:pointer-events-none [&>[aria-disabled=true]]:opacity-40 motion-reduce:*:transition-none motion-reduce:[&>a[href]]:active:translate-y-0 motion-reduce:[&>button:not(:disabled)]:active:translate-y-0",
        local.class
      )}
    >
      {local.children}
    </li>
  )
}
