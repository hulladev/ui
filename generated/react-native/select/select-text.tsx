import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type SelectTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
}
export function SelectText({
  children,
  style,
  theme: override,
  disabled = false,
  ...props
}: SelectTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          flexShrink: 1,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "400",
          fontFamily: theme.fonts?.regular,
          color: disabled ? theme.colors.disabledForeground : theme.colors.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
