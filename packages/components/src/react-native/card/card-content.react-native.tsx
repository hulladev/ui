import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type CardContentProps = ComponentPropsWithRef<typeof View>

export function CardContent({ children, style, ...props }: CardContentProps) {
  return (
    <View {...props} style={[{ minWidth: 0 }, style]}>
      {children}
    </View>
  )
}
