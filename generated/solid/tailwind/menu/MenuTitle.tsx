/** @jsxImportSource solid-js */
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'

export type MenuTitleProps = ParentProps<JSX.HTMLElementTags['summary']>

export function MenuTitle({ children, ...props }: MenuTitleProps) {
  return (
    <summary {...props} class={cn('gap-md hover:bg-fg/10 dark:hover:bg-fgdark/20 py-sm px-xs group-open:mb-sm text-fg/80 hover:text-fg dark:text-fgdark/80 dark:hover:text-fgdark flex w-full cursor-pointer list-none appearance-none items-center justify-between rounded-md transition-colors', props.class)}>
      {children}
      <svg viewBox="0 -9 3 24" class="h-[1.5rem] w-[2rem] rotate-0 transition-transform group-open:rotate-90">
        <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      </svg>
    </summary>
  )
}
