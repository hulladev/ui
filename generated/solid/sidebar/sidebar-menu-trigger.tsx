import { vn, cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

const $control = vn({
  default:
    "relative flex min-h-9 w-full min-w-0 items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm leading-5 text-muted-foreground no-underline transition-[background-color,color] duration-150 hover:bg-foreground/[0.055] hover:text-foreground aria-[current=page]:bg-primary/[0.09] aria-[current=page]:font-medium aria-[current=page]:text-primary aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-2 aria-[current=page]:before:left-0 aria-[current=page]:before:w-0.5 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-primary aria-[current=page]:[&>svg]:text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
})

export type SidebarMenuTriggerProps = JSX.IntrinsicElements["summary"]

export function SidebarMenuTrigger(props: SidebarMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <summary
      {...rest}
      data-slot="sidebar-menu-trigger"
      class={cn(
        $control("default"),
        "list-none pr-8 after:absolute after:right-3 after:size-1.5 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:transition-transform after:duration-200 group-open/collapsible:after:translate-y-0.5 group-open/collapsible:after:rotate-[225deg] motion-reduce:after:transition-none [&::-webkit-details-marker]:hidden",
        local.class
      )}
    >
      {local.children}
    </summary>
  )
}
