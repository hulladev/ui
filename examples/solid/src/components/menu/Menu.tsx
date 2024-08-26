/** @jsxImportSource solid-js **/
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'

export type MenuProps = ParentProps<JSX.DetailsHtmlAttributes<HTMLDetailsElement>>

export function Menu({ children, ...props }: MenuProps) {
  return (
    <details {...props} class={cn('group flex items-center', props.class)}>
      {children}
    </details>
  )
}
