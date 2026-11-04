import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type StepperTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  status?: "complete" | "current" | "upcoming"
  disabled?: boolean
}
export function StepperText({
  children,
  style,
  status = "upcoming",
  disabled = false,
  theme: override,
  ...props
}: StepperTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: disabled
            ? theme.colors.disabledForeground
            : status === "upcoming"
              ? theme.colors.mutedForeground
              : theme.colors.foreground,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: status === "current" ? "600" : "500",
          fontFamily: status === "current" ? theme.fonts?.semibold : theme.fonts?.medium,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
