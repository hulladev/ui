import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type SeparatorProps = ComponentPropsWithRef<typeof View> & {
  orientation?: "horizontal" | "vertical"
  theme?: NativeTheme
}

export function Separator({
  children,
  style,
  orientation = "horizontal",
  theme: override,
  ...props
}: SeparatorProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      accessible={false}
      {...props}
      style={[
        { backgroundColor: theme.colors.border },
        orientation === "horizontal"
          ? { height: 1, alignSelf: "stretch" }
          : { width: 1, alignSelf: "stretch" },
        style,
      ]}
    >
      {children}
    </View>
  )
}
