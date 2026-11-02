import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type LinkCardTitleProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
  selected?: boolean
}

export function LinkCardTitle({
  children,
  style,
  disabled = false,
  selected = false,
  theme: override,
  ...props
}: LinkCardTitleProps) {
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
              : theme.colors.foreground,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          letterSpacing: -0.21,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
