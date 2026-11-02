import type { ComponentPropsWithRef } from "react"
import { Text as NativeText } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"

export type TextProps = ComponentPropsWithRef<typeof NativeText> & {
  variant?: "body" | "heading" | "caption" | "code"
  tone?: "default" | "muted" | "danger"
  theme?: NativeTheme
}

export function Text({
  children,
  style,
  variant = "body",
  tone = "default",
  theme: override,
  ...props
}: TextProps) {
  const theme = useNativeTheme(override)
  const typography = {
    body: { fontSize: 14, lineHeight: 20, fontFamily: theme.fonts?.regular },
    heading: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: -0.5,
      fontWeight: "600" as const,
      fontFamily: theme.fonts?.semibold,
    },
    caption: { fontSize: 12, lineHeight: 16, fontFamily: theme.fonts?.regular },
    code: {
      fontSize: 13,
      lineHeight: 20,
      fontFamily: theme.fonts?.mono,
      fontVariant: ["tabular-nums" as const],
    },
  }
  return (
    <NativeText
      accessibilityRole={variant === "heading" ? "header" : undefined}
      {...props}
      style={[
        {
          color:
            tone === "muted"
              ? theme.colors.mutedForeground
              : tone === "danger"
                ? theme.colors.danger
                : theme.colors.foreground,
        },
        typography[variant],
        style,
      ]}
    >
      {children}
    </NativeText>
  )
}
