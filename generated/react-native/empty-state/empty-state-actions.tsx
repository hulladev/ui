import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type EmptyStateActionsProps = ComponentPropsWithRef<typeof View>

export function EmptyStateActions({ children, style, ...props }: EmptyStateActionsProps) {
  return (
    <View
      {...props}
      style={[{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 }, style]}
    >
      {children}
    </View>
  )
}
