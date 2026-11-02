import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type TableCellProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function TableCell({ children, style, theme: override, ...props }: TableCellProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      selectable
      {...props}
      style={[
        {
          width: 140,
          flexShrink: 0,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: theme.colors.foreground,
          fontSize: 14,
          lineHeight: 20,
          fontFamily: theme.fonts?.regular,
          fontVariant: ["tabular-nums"],
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
