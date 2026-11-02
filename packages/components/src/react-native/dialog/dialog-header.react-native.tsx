import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type DialogHeaderProps = ComponentPropsWithRef<typeof View>
export function DialogHeader({ children, style, ...props }: DialogHeaderProps) {
  return (
    <View {...props} style={[{ gap: 6 }, style]}>
      {children}
    </View>
  )
}
