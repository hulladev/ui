import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type PaginationItemTextProps = ComponentPropsWithRef<typeof Text> & {
  current?: boolean
  disabled?: boolean
  theme?: NativeTheme
}

export function PaginationItemText({
  children,
  style,
  current = false,
  disabled = false,
  theme: override,
  ...props
}: PaginationItemTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: disabled
            ? theme.colors.disabledForeground
            : current
              ? theme.colors.background
              : theme.colors.foreground,
          fontSize: 12,
          lineHeight: 16,
          fontWeight: current ? "600" : "500",
          fontFamily: theme.fonts?.mono,
          fontVariant: ["tabular-nums"],
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
