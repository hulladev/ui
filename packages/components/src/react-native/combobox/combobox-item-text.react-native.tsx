import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type ComboboxItemTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  selected?: boolean
  disabled?: boolean
}
export function ComboboxItemText({
  children,
  style,
  theme: override,
  selected = false,
  disabled = false,
  ...props
}: ComboboxItemTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          flexShrink: 1,
          fontSize: 13,
          lineHeight: 20,
          fontWeight: "400",
          fontFamily: theme.fonts?.regular,
          color: disabled
            ? theme.colors.disabledForeground
            : selected
              ? theme.colors.primaryText
              : theme.colors.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
