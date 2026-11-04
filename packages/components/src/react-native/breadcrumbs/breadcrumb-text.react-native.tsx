import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type BreadcrumbTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  current?: boolean
  disabled?: boolean
}
export function BreadcrumbText({
  children,
  style,
  current = false,
  disabled = false,
  theme: override,
  ...props
}: BreadcrumbTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: disabled
            ? theme.colors.disabledForeground
            : current
              ? theme.colors.foreground
              : theme.colors.mutedForeground,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: current ? "500" : "400",
          fontFamily: current ? theme.fonts?.medium : theme.fonts?.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
