import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type ListProps = ComponentPropsWithRef<typeof View>

export function List({ children, style, ...props }: ListProps) {
  return (
    <View {...props} style={[{ gap: 0 }, style]}>
      {children}
    </View>
  )
}
