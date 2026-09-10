import { vn, cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

const $control = vn({
  default:
    "relative flex min-h-9 ml-[var(--sidebar-row-inset)] w-[calc(100%-var(--sidebar-row-inset))] min-w-0 items-center gap-2.5 rounded-[4px] pr-2.5 pl-[calc(var(--sidebar-inset,0.625rem)-var(--sidebar-row-inset))] [--sidebar-row-inset:max(0px,calc(var(--sidebar-inset,0.625rem)-0.875rem-5px))] py-1.5 text-left text-sm leading-5 text-muted-foreground no-underline transition-[background-color,color] duration-150 [&:not(:disabled):not([aria-disabled=true])]:hover:bg-hover-surface [&:not(:disabled):not([aria-disabled=true])]:hover:text-foreground [&:not(:disabled):not([aria-disabled=true])]:aria-[current=page]:bg-selected-surface [&:not(:disabled):not([aria-disabled=true])]:aria-[current=page]:hover:bg-selected-hover-surface aria-[current=page]:font-medium [&:not(:disabled):not([aria-disabled=true])]:aria-[current=page]:text-primary-text aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-0 aria-[current=page]:before:left-[calc(var(--sidebar-inset,0.625rem)-0.875rem-var(--sidebar-row-inset))] aria-[current=page]:before:z-20 aria-[current=page]:before:w-px aria-[current=page]:before:opacity-[var(--sidebar-railed,0)] aria-[current=page]:before:bg-primary aria-[current=page]:[&>svg]:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-disabled-foreground aria-disabled:cursor-not-allowed aria-disabled:text-disabled-foreground motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
})

export type SidebarMenuLinkProps = JSX.IntrinsicElements["a"]

export function SidebarMenuLink(props: SidebarMenuLinkProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <a {...rest} data-slot="sidebar-menu-link" class={cn($control("default"), local.class)}>
      {local.children}
    </a>
  )
}
