import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type AccordionTriggerTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
}
export function AccordionTriggerText({
  children,
  style,
  disabled = false,
  theme: override,
  ...props
}: AccordionTriggerTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: disabled ? theme.colors.disabledForeground : theme.colors.foreground,
          fontSize: 15,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          letterSpacing: -0.15,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
