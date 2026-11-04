import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type CommandEmptyProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function CommandEmpty({ children, style, theme: override, ...props }: CommandEmptyProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "400",
          fontFamily: theme.fonts?.regular,
          color: theme.colors.mutedForeground,
          paddingHorizontal: 16,
          paddingVertical: 40,
          textAlign: "center",
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
