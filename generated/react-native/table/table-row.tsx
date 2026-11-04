import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type TableRowProps = ComponentPropsWithRef<typeof View> & {
  theme?: NativeTheme
  separator?: boolean
}

export function TableRow({
  children,
  style,
  separator = true,
  theme: override,
  ...props
}: TableRowProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      {...props}
      style={[
        {
          flexDirection: "row",
          alignItems: "stretch",
          borderBottomWidth: separator ? 1 : 0,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
