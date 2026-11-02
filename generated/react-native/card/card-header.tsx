import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type CardHeaderProps = ComponentPropsWithRef<typeof View>

export function CardHeader({ children, style, ...props }: CardHeaderProps) {
  return (
    <View {...props} style={[{ minWidth: 0, gap: 6 }, style]}>
      {children}
    </View>
  )
}
