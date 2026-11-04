import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type TabsListProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }
export function TabsList({ children, style, theme: override, ...props }: TabsListProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      accessibilityRole="tablist"
      {...props}
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-end",
          paddingHorizontal: 4,
          gap: 4,
          borderBottomWidth: 1,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
