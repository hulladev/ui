import type { Compose, Config, Variants } from '@hulla/style'

export const vn = <
  const V extends Variants,
  const DV extends {
    [K in keyof V]?: keyof V[K]
  },
  const B extends string,
  const C extends Compose,
>(
  config: Config<V, DV, B, C>
) => config

export const cn = <const T extends string>(...base: T[]) => base
