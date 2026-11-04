import type { TextStyle } from "react-native"
import type { NativeTheme } from "./theme.react-native"
import { alpha } from "@hulla/style-native/color"

export function textInputStyle(
  theme: NativeTheme,
  focused: boolean,
  inactive: boolean,
  invalid: boolean
): TextStyle {
  return {
    minHeight: 48,
    minWidth: 0,
    borderWidth: 1,
    outlineWidth: 0,
    borderRadius: theme.radius.md,
    borderColor: inactive
      ? theme.colors.disabledBorder
      : invalid
        ? theme.colors.danger
        : focused
          ? theme.colors.focusRing
          : alpha(theme.colors.foreground, 0.25),
    backgroundColor: inactive ? theme.colors.disabledSurface : theme.colors.surface,
    boxShadow: inactive
      ? undefined
      : focused
        ? `0px 0px 0px 2px ${alpha(theme.colors.focusRing, 0.25)}, inset 0px 1px 2px rgba(0,0,0,0.025)`
        : "inset 0px 1px 2px rgba(0,0,0,0.025)",
    color: inactive ? theme.colors.disabledForeground : theme.colors.foreground,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: theme.fonts?.regular,
    paddingHorizontal: 12,
    paddingVertical: 11,
  }
}
