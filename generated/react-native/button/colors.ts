import type { NativeTheme } from "@/lib/native-theme"
import { isNativeDark, nativeColorAlpha } from "@/lib/native-color"

export type ButtonVariant = "primary" | "secondary" | "inverted" | "outline" | "ghost" | "danger"

export function buttonColors(theme: NativeTheme, variant: ButtonVariant, disabled: boolean) {
  const colors = theme.colors
  if (disabled)
    return {
      background: colors.disabledSurface,
      border: colors.disabledBorder,
      foreground: colors.disabledForeground,
    }
  const dark = isNativeDark(theme)
  const variants = {
    primary: {
      background: colors.primary,
      border: colors.primary,
      foreground: colors.primaryForeground,
    },
    secondary: {
      background: nativeColorAlpha(colors.foreground, dark ? 0.12 : 0.05),
      border: colors.border,
      foreground: colors.foreground,
    },
    inverted: {
      background: colors.foreground,
      border: colors.foreground,
      foreground: colors.background,
    },
    outline: {
      background: "transparent",
      border: nativeColorAlpha(colors.foreground, 0.2),
      foreground: colors.foreground,
    },
    ghost: { background: "transparent", border: "transparent", foreground: colors.mutedForeground },
    danger: {
      background: dark ? nativeColorAlpha(colors.danger, 0.15) : colors.danger,
      border: dark ? nativeColorAlpha(colors.danger, 0.25) : colors.danger,
      foreground: dark ? colors.danger : colors.onEmphasis,
    },
  }
  return variants[variant]
}
