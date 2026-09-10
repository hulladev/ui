import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $variant = vn({
  default:
    "text-foreground enabled:hover:bg-hover-surface enabled:data-[highlighted=true]:bg-hover-surface",
  danger:
    "text-danger enabled:hover:bg-danger/10 enabled:data-[highlighted=true]:bg-danger/10 dark:enabled:hover:bg-danger/15 dark:enabled:data-[highlighted=true]:bg-danger/15",
})

export type DropdownMenuItemProps = JSX.IntrinsicElements["button"] & {
  variant?: typeof $variant.infer
}

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { role: "menuitem", tabIndex: -1, type: "button", variant: "default" } as const,
      props
    ),
    ["children", "class", "role", "tabIndex", "type", "variant"]
  )

  return (
    <button
      {...rest}
      role={local.role}
      tabindex={local.tabIndex}
      type={local.type}
      data-slot="dropdown-menu-item"
      data-variant={local.variant}
      class={cn(
        "flex min-h-8 w-full cursor-pointer select-none items-center gap-2 rounded-none px-3 py-2 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 disabled:cursor-not-allowed disabled:text-disabled-foreground [&_[data-slot=kbd]]:ml-auto [&_[data-slot=kbd]]:border-0 [&_[data-slot=kbd]]:bg-transparent [&_[data-slot=kbd]]:px-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
