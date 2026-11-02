import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type PopoverDescriptionProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function PopoverDescription({
  children,
  style,
  theme: override,
  ...props
}: PopoverDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 12,
          lineHeight: 20,
          fontWeight: "400",
          fontFamily: theme.fonts?.regular,
          color: theme.colors.mutedForeground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
