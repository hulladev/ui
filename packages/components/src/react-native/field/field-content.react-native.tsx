import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type FieldContentProps = ComponentPropsWithRef<typeof View>

export function FieldContent({ children, style, ...props }: FieldContentProps) {
  return (
    <View {...props} style={[{ minWidth: 0, gap: 2 }, style]}>
      {children}
    </View>
  )
}
