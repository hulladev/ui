/** @jsxImportSource solid-js */
import { cn } from '@/lib/style'
import type { JSX, ParentProps } from 'solid-js'

export type MenuItemProps = ParentProps<
  JSX.DetailsHtmlAttributes<HTMLLIElement> & {
    active?: boolean
    nested?: boolean
  }
>

export function MenuItem({ children, ...props }: MenuItemProps) {
  return (
    <li
      {...props}
      data-active={props.active}
      data-nested={props.nested}
      class={cn(
        'hover:bg-fg/10 dark:hover:bg-fgdark/20 py-sm px-md text-fg/80 hover:text-fg dark:text-fgdark/80 dark:hover:text-fgdark data-[active]:bg-primary/20 data-[active]:text-primary dark:data-[active]:text-primary data-[active]:hover:bg-primary/30 dark:data-[active]:hover:bg-primary/30 w-full cursor-pointer rounded-md text-sm transition-colors active:animate-pulse active:duration-150 data-[nested]:py-0 data-[nested]:hover:bg-transparent dark:data-[nested]:hover:bg-transparent',
        props.class
      )}
    >
      {children}
    </li>
  )
}
