import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type TabTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  selected?: boolean
  disabled?: boolean
}
export function TabText({
  children,
  style,
  selected = false,
  disabled = false,
  theme: override,
  ...props
}: TabTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: disabled
            ? theme.colors.disabledForeground
            : selected
              ? theme.colors.primaryText
              : theme.colors.mutedForeground,
          fontSize: 14,
          lineHeight: 14,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          letterSpacing: -0.14,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
