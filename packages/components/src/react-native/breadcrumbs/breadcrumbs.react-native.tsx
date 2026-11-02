import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type BreadcrumbsProps = ComponentPropsWithRef<typeof View>
export function Breadcrumbs({ children, style, ...props }: BreadcrumbsProps) {
  return (
    <View
      accessibilityLabel="Breadcrumb"
      {...props}
      style={[
        { flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: 8, rowGap: 4 },
        style,
      ]}
    >
      {children}
    </View>
  )
}
