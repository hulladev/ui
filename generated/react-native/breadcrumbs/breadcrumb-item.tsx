import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type BreadcrumbItemProps = ComponentPropsWithRef<typeof View>

export function BreadcrumbItem({ children, style, ...props }: BreadcrumbItemProps) {
  return (
    <View
      testID="breadcrumb-item"
      {...props}
      style={[{ minWidth: 0, flexDirection: "row", alignItems: "center", gap: 8 }, style]}
    >
      {children}
    </View>
  )
}
