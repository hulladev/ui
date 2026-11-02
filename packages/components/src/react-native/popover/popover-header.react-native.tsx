import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type PopoverHeaderProps = ComponentPropsWithRef<typeof View>
export function PopoverHeader({ children, style, ...props }: PopoverHeaderProps) {
  return (
    <View
      {...props}
      style={[{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }, style]}
    >
      {children}
    </View>
  )
}
