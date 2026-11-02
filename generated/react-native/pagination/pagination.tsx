import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type PaginationProps = ComponentPropsWithRef<typeof View>
export function Pagination({ children, style, ...props }: PaginationProps) {
  return (
    <View
      accessibilityLabel="Pagination"
      {...props}
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
