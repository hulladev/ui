/** @jsxImportSource solid-js **/
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'
import { menu } from '../style/tailwind.menu'

export type MenuProps = ParentProps<JSX.DetailsHtmlAttributes<HTMLDetailsElement>>

export function Menu({ children, ...props }: MenuProps) {
  return (
    <details {...props} class={cn(menu, props.class)}>
      {children}
    </details>
  )
}
