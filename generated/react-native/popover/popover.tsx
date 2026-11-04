import type { DialogProps } from "../dialog/dialog"
import { Dialog } from "../dialog/dialog"
import { useNativeTheme } from "@/lib/theme"
import { alpha } from "@hulla/style-native/color"
export type PopoverProps = DialogProps
export function Popover({
  children,
  contentStyle,
  contentContainerStyle,
  theme: override,
  ...props
}: PopoverProps) {
  const theme = useNativeTheme(override)
  return (
    <Dialog
      {...props}
      theme={theme}
      contentStyle={[
        {
          maxWidth: 352,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surfaceRaised,
          borderColor:
            theme.mode === "dark" ? alpha(theme.colors.foreground, 0.15) : theme.colors.border,
          boxShadow:
            theme.mode === "dark"
              ? "0 2px 4px -2px rgba(0,0,0,0.24), 0 16px 48px -16px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 2px 4px -2px rgba(0,0,0,0.1), 0 16px 48px -16px rgba(0,0,0,0.26)",
        },
        contentStyle,
      ]}
      contentContainerStyle={[{ padding: 6, paddingBottom: 6, gap: 0 }, contentContainerStyle]}
    >
      {children}
    </Dialog>
  )
}
