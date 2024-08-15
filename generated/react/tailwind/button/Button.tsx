/** @jsxImportSource react */
import { vn } from '@/lib/style'
import type { VariantProps } from '@hulla/style'
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react'

const css = vn({
  base: 'cursor-pointer whitespace-nowrap rounded-md px-md py-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all active:translate-y-sm disabled:opacity-70',
  props: {
    variant: {
      default: 'bg-fg dark:bg-fgdark text-bg dark:text-bgdark hover:fg/80 focus-visible:outline-bg',
      primary: 'bg-primary text-bg dark:text-fgdark hover:bg-primary/80 focus-visible:outline-primary',
      outline: 'bg-transparent border border-text hover:bg-primary/5 dark:hover:bg-primary/15 focus-visible:outline-bg',
      ghost: 'bg-transparent shadow-none',
    },
    size: {
      sm: 'text-sm px-sm py-xs',
      md: 'text-md px-md py-sm',
      lg: 'text-lg px-xl py-md',
    },
  },
  defaults: {
    variant: 'default',
    size: 'md',
  },
})

type BaseProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export type Props = PropsWithChildren<BaseProps & VariantProps<typeof css>>

export function Button({ children, ...props }: Props) {
  return (
    <button {...props} className={css(props)}>
      {children}
    </button>
  )
}
