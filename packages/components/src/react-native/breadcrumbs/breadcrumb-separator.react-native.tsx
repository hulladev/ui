import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type BreadcrumbSeparatorProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }
export function BreadcrumbSeparator({
  children,
  style,
  theme: override,
  ...props
}: BreadcrumbSeparatorProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      testID="breadcrumb-separator"
      accessible={false}
      {...props}
      style={[
        {
          width: 6,
          height: 6,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.colors.mutedForeground,
          transform: [{ rotate: "-45deg" }],
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
