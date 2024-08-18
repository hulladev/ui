import { cn } from '@/lib/style'
import type { DetailedHTMLProps, MenuHTMLAttributes, PropsWithChildren } from 'react'
import { menulist } from '../style/tailwind.menu'

type BaseProps = DetailedHTMLProps<MenuHTMLAttributes<HTMLMenuElement>, HTMLMenuElement>
export type MenuListProps = PropsWithChildren<BaseProps>

export function MenuList({ children, className, ...props }: MenuListProps) {
  return (
    <menu {...props} className={cn(menulist, className)}>
      {children}
    </menu>
  )
}
