/** @jsxImportSource solid-js */
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'
import { menutitle } from '../style/tailwind.menu'

export type MenuTitleProps = ParentProps<JSX.HTMLElementTags['summary']>

export function MenuTitle({ children, ...props }: MenuTitleProps) {
  return (
    <summary {...props} class={cn(menutitle, props.class)}>
      {children}
      <svg viewBox="0 -9 3 24" class="h-[1.5rem] w-[2rem] rotate-0 transition-transform group-open:rotate-90">
        <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      </svg>
    </summary>
  )
}
