import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
import { alpha } from "@hulla/style-native/color"

export type ProgressProps = ComponentPropsWithRef<typeof View> & {
  value?: number
  max?: number
  theme?: NativeTheme
}

export function Progress({
  children,
  style,
  value,
  max = 100,
  theme: override,
  accessibilityValue,
  accessibilityState,
  ...props
}: ProgressProps) {
  const theme = useNativeTheme(override)
  const maximum = Number.isFinite(max) && max > 0 ? max : 100
  const current =
    typeof value === "number" && Number.isFinite(value)
      ? Math.min(maximum, Math.max(0, value))
      : undefined
  const ratio = current === undefined ? 0.35 : current / maximum
  const accessibleValue = {
    min: 0,
    max: maximum,
    ...(current === undefined ? { text: "In progress" } : { now: current }),
    ...accessibilityValue,
  }
  const busy = current === undefined || Boolean(accessibilityState?.busy || props["aria-busy"])
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      {...props}
      accessibilityState={{ ...accessibilityState, busy }}
      aria-busy={busy}
      accessibilityValue={accessibleValue}
      aria-valuemin={props["aria-valuemin"] ?? accessibleValue.min}
      aria-valuemax={props["aria-valuemax"] ?? accessibleValue.max}
      aria-valuenow={props["aria-valuenow"] ?? accessibleValue.now}
      aria-valuetext={props["aria-valuetext"] ?? accessibleValue.text}
      style={[
        {
          height: 6,
          borderRadius: 999,
          backgroundColor: alpha(theme.colors.foreground, 0.1),
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
          backgroundColor: theme.colors.primary,
        }}
      />
      {children}
    </View>
  )
}
