import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type FieldProps = ComponentPropsWithRef<typeof View>

export function Field({ children, style, ...props }: FieldProps) {
  return (
    <View {...props} style={[{ minWidth: 0, gap: 6 }, style]}>
      {children}
    </View>
  )
}
