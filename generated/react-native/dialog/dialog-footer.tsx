import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type DialogFooterProps = ComponentPropsWithRef<typeof View>
export function DialogFooter({ children, style, ...props }: DialogFooterProps) {
  return (
    <View
      {...props}
      style={[
        {
          marginTop: 4,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: 8,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
