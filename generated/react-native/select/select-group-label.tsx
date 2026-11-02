import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type SelectGroupLabelProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function SelectGroupLabel({
  children,
  style,
  theme: override,
  ...props
}: SelectGroupLabelProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          color: theme.colors.mutedForeground,
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
