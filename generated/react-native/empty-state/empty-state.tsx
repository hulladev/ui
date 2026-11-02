import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type EmptyStateProps = ComponentPropsWithRef<typeof View>

export function EmptyState({ children, style, ...props }: EmptyStateProps) {
  return (
    <View {...props} style={[{ paddingVertical: 32, gap: 12, alignItems: "center" }, style]}>
      {children}
    </View>
  )
}
