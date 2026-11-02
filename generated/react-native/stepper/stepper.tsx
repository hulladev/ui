import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type StepperProps = ComponentPropsWithRef<typeof View>
export function Stepper({ children, style, ...props }: StepperProps) {
  return (
    <View accessibilityRole="list" {...props} style={[{ gap: 16 }, style]}>
      {children}
    </View>
  )
}
