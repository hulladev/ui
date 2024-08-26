/** @jsxImportSource solid-js */
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'

export type MenuListProps = ParentProps<JSX.MenuHTMLAttributes<HTMLMenuElement>>

export function MenuList({ children, ...props }: MenuListProps) {
  return (
    // @ts-expect-error issue in solid typedef: https://github.com/solidjs/solid/issues/2257
    <menu {...props} class={cn('space-y-sm w-full', props.class)}>
      {children}
    </menu>
  )
}
