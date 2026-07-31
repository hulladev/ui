import { mergeProps, splitProps, type JSX } from "solid-js"
import { dropdownMenuItemVariants } from "@/+css/dropdown-menu.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $variant = resolve(dropdownMenuItemVariants)

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
        "flex min-h-8 w-full cursor-pointer select-none items-center gap-2 rounded-none px-2 py-1.5 text-left text-[0.8125rem] leading-5 outline-none transition-colors duration-100 disabled:pointer-events-none disabled:opacity-45 [&_[data-slot=kbd]]:ml-auto [&_[data-slot=kbd]]:border-0 [&_[data-slot=kbd]]:bg-transparent [&_[data-slot=kbd]]:px-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
