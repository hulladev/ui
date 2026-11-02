import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type DrawerHeaderProps = ComponentPropsWithRef<typeof View>
export function DrawerHeader({ children, style, ...props }: DrawerHeaderProps) {
  return (
    <View {...props} style={[{ gap: 6 }, style]}>
      {children}
    </View>
  )
}
