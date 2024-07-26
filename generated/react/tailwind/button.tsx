import { vn } from '@/lib/style'
import type { VariantProps } from '@hulla/style'
import type { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from 'react'

export const css = vn({
  base: 'rounded-md px-4 py-2 text-fg',
  variants: {
    default: 'bg-bg text-fg',
    primary: 'bg-primary-500',
  },
  defaultVariant: 'default',
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
