import type { DialogProps } from "../dialog/dialog"
import { Dialog } from "../dialog/dialog"
import { useNativeTheme } from "@/lib/native-theme"
export type CommandProps = DialogProps
export function Command({
  children,
  contentStyle,
  contentContainerStyle,
  theme: override,
  ...props
}: CommandProps) {
  const theme = useNativeTheme(override)
  return (
    <Dialog
      {...props}
      theme={theme}
      contentStyle={[{ maxWidth: 672, backgroundColor: theme.colors.surfaceRaised }, contentStyle]}
      contentContainerStyle={[{ padding: 0, paddingBottom: 0, gap: 0 }, contentContainerStyle]}
    >
      {children}
    </Dialog>
  )
}
