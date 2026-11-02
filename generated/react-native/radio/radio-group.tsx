import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type RadioGroupProps = ComponentPropsWithRef<typeof View>
export function RadioGroup({ children, style, ...props }: RadioGroupProps) {
  return (
    <View accessibilityRole="radiogroup" {...props} style={[{ gap: 4 }, style]}>
      {children}
    </View>
  )
}
