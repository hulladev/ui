import { vn } from "@/lib/style"

export const sidebarMenuControls = vn({
  default:
    "relative flex min-h-9 ml-[var(--sidebar-row-inset)] w-[calc(100%-var(--sidebar-row-inset))] min-w-0 items-center gap-2.5 pr-2.5 pl-[calc(var(--sidebar-inset,0.625rem)-var(--sidebar-row-inset))] [--sidebar-row-inset:max(0px,calc(var(--sidebar-inset,0.625rem)-0.875rem+var(--sidebar-railed,0)*0.5rem))] py-1.5 text-left text-sm leading-5 no-underline [&:not(:disabled):not([aria-disabled=true])]:aria-[current=page]:bg-selected-surface [&:not(:disabled):not([aria-disabled=true])]:aria-[current=page]:hover:bg-selected-hover-surface aria-[current=page]:font-medium [&:not(:disabled):not([aria-disabled=true])]:aria-[current=page]:text-primary-text aria-[current=page]:[&>svg]:text-primary-text focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-disabled-foreground aria-disabled:cursor-not-allowed aria-disabled:text-disabled-foreground [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
})

// Nested rows begin 0.5rem after their rail, matching TreeGroup's border-to-label gap.
// Each child rail aligns with the center of the parent’s 16px icon; child content stays indented even without rails.
// Explicit modes inherit through a branch; a nested menu can override its ancestor.
export const sidebarMenuLayout = vn({
  default:
    "relative isolate m-0 grid min-w-0 list-none gap-0.5 p-0 [--sidebar-railed:var(--sidebar-lines,0)] [--sidebar-inset:calc(0.625rem+var(--sidebar-railed)*0.875rem)] [&>li]:[--sidebar-child-indent:calc(var(--sidebar-inset)-0.125rem)] data-[lines=none]:[--sidebar-lines:0] data-[lines=all]:[--sidebar-lines:1] data-[lines=nested]:[--sidebar-lines:initial] before:pointer-events-none before:absolute before:inset-y-0 before:left-[calc(var(--sidebar-inset)-0.875rem)] before:z-10 before:w-px before:bg-border before:opacity-[var(--sidebar-railed)] [&_[data-slot=sidebar-menu]]:[--sidebar-inset:calc(var(--sidebar-child-indent)+1.5rem)] [&_[data-slot=sidebar-menu]]:mt-0.5 [&_[data-slot=sidebar-menu]]:[--sidebar-railed:var(--sidebar-lines,1)]",
})
