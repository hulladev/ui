import { vn } from '@/lib/style'

export const css = vn({
  base: 'rounded-md px-4 py-2 text-fg',
  variants: {
    default: 'bg-bg text-fg',
    primary: 'bg-primary-500',
  },
  defaultVariant: 'default',
})
