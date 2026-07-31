import { mergeProps, splitProps, type JSX } from "solid-js"

export type DropdownMenuGroupProps = JSX.IntrinsicElements["div"]

export function DropdownMenuGroup(props: DropdownMenuGroupProps) {
  const [local, rest] = splitProps(mergeProps({ role: "group" } as const, props), [
    "children",
    "class",
    "role",
  ])

  return (
    <div {...rest} role={local.role} data-slot="dropdown-menu-group" class={local.class}>
      {local.children}
    </div>
  )
}
