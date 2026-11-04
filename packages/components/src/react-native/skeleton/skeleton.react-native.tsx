import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
import { alpha } from "@hulla/style-native/color"

export type SkeletonProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }

export function Skeleton({ children, style, theme: override, ...props }: SkeletonProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...props}
      style={[
        {
          height: 16,
          borderRadius: theme.radius.md,
          backgroundColor: alpha(theme.colors.foreground, theme.mode === "dark" ? 0.1 : 0.08),
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
