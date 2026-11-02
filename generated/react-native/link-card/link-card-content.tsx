import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type LinkCardContentProps = ComponentPropsWithRef<typeof View>

export function LinkCardContent({ children, style, ...props }: LinkCardContentProps) {
  return (
    <View {...props} style={[{ minWidth: 0, flex: 1, gap: 2 }, style]}>
      {children}
    </View>
  )
}
