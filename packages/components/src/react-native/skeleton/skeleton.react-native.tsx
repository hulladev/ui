import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeColorAlpha, isNativeDark } from "@/lib/native-color"

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
          backgroundColor: nativeColorAlpha(
            theme.colors.foreground,
            isNativeDark(theme) ? 0.1 : 0.08
          ),
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
