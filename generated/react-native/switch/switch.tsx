import type { ComponentPropsWithRef } from "react"
import { Platform, Switch as NativeSwitch } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { isNativeDark, nativeColorAlpha } from "@/lib/native-color"

export type SwitchProps = ComponentPropsWithRef<typeof NativeSwitch> & { theme?: NativeTheme }

export function Switch({
  theme: override,
  disabled,
  accessibilityState,
  trackColor,
  thumbColor,
  ...props
}: SwitchProps) {
  const theme = useNativeTheme(override)
  const inactive = Boolean(disabled || accessibilityState?.disabled)
  const resolvedThumbColor =
    thumbColor ?? (isNativeDark(theme) ? theme.colors.foreground : theme.colors.surfaceRaised)
  return (
    <NativeSwitch
      {...props}
      disabled={inactive}
      accessibilityState={{ ...accessibilityState, disabled: inactive }}
      trackColor={
        trackColor ?? {
          false: inactive
            ? theme.colors.disabledBorder
            : nativeColorAlpha(theme.colors.foreground, isNativeDark(theme) ? 0.18 : 0.12),
          true: inactive ? theme.colors.disabledForeground : theme.colors.primary,
        }
      }
      thumbColor={resolvedThumbColor}
      // React Native Web 0.21 resolves the checked thumb independently of thumbColor.
      {...(Platform.OS === "web" ? { activeThumbColor: resolvedThumbColor } : {})}
    />
  )
}
