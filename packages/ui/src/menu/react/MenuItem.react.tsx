import { cn } from '@/lib/style'
import type { DetailedHTMLProps, LiHTMLAttributes, PropsWithChildren } from 'react'
import { menuitem } from '../style/tailwind.menu'

type BaseProps = DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
export type MenuItemProps = PropsWithChildren<
  BaseProps & {
    active?: boolean
    nested?: boolean
  }
>

export function MenuItem({ children, className, ...props }: MenuItemProps) {
  return (
    <li {...props} data-active={props.active} data-nested={props.nested} className={cn(menuitem, className)}>
      {children}
    </li>
  )
}
