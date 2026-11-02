import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeColorAlpha } from "@/lib/native-color"

export type MeterProps = ComponentPropsWithRef<typeof View> & {
  value: number
  min?: number
  max?: number
  tone?: "neutral" | "success" | "warning" | "danger"
  theme?: NativeTheme
}

export function Meter({
  children,
  style,
  value,
  min = 0,
  max = 100,
  tone = "success",
  theme: override,
  accessibilityValue,
  accessibilityState,
  ...props
}: MeterProps) {
  const theme = useNativeTheme(override)
  const minimum = Number.isFinite(min) ? min : 0
  const maximum = Number.isFinite(max) && max > minimum ? max : minimum + 100
  const current = Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, value)) : minimum
  const ratio = (current - minimum) / (maximum - minimum)
  const accessibleValue = { min: minimum, max: maximum, now: current, ...accessibilityValue }
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      {...props}
      accessibilityState={accessibilityState}
      accessibilityValue={accessibleValue}
      aria-valuemin={props["aria-valuemin"] ?? accessibleValue.min}
      aria-valuemax={props["aria-valuemax"] ?? accessibleValue.max}
      aria-valuenow={props["aria-valuenow"] ?? accessibleValue.now}
      aria-valuetext={props["aria-valuetext"] ?? accessibleValue.text}
      aria-busy={props["aria-busy"] ?? accessibilityState?.busy}
      style={[
        {
          height: 8,
          borderRadius: 999,
          backgroundColor: nativeColorAlpha(theme.colors.foreground, 0.1),
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View
        accessible={false}
        style={{
          height: "100%",
          width: `${ratio * 100}%`,
          borderRadius: 999,
          backgroundColor: tone === "neutral" ? theme.colors.primary : theme.colors[tone],
        }}
      />
      {children}
    </View>
  )
}
