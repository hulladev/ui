/** @jsxImportSource solid-js */
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'
import { menuitem } from '../style/tailwind.menu'

export type MenuItemProps = ParentProps<
  JSX.DetailsHtmlAttributes<HTMLLIElement> & {
    active?: boolean
    nested?: boolean
  }
>

export function MenuItem({ children, ...props }: MenuItemProps) {
  return (
    <li {...props} data-active={props.active} data-nested={props.nested} class={cn(menuitem, props.class)}>
      {children}
    </li>
  )
}
