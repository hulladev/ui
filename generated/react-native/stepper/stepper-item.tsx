import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, Text, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeColorAlpha } from "@/lib/native-color"
export type StepperItemProps = ComponentPropsWithRef<typeof Pressable> & {
  step: number
  status?: "complete" | "current" | "upcoming"
  theme?: NativeTheme
}
export function StepperItem({
  children,
  style,
  step,
  status = "upcoming",
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  onPress,
  accessibilityHint,
  ...props
}: StepperItemProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : "text"}
      {...props}
      disabled={inactive || !onPress}
      aria-current={status === "current" ? "step" : undefined}
      accessibilityState={{
        ...accessibilityState,
        disabled: inactive,
        selected: status === "current",
      }}
      accessibilityHint={
        accessibilityHint ??
        (status === "complete"
          ? "Completed step"
          : status === "current"
            ? "Current step"
            : "Upcoming step")
      }
      onPress={onPress}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      style={(state) => [
        {
          minHeight: 48,
          minWidth: 48,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          borderLeftWidth: 2,
          borderColor:
            status === "current"
              ? theme.colors.foreground
              : nativeColorAlpha(theme.colors.foreground, status === "complete" ? 0.4 : 0.15),
          paddingLeft: 20,
          paddingVertical: 4,
          outlineWidth: focused && !inactive ? 2 : 0,
          outlineColor: theme.colors.focusRing,
          outlineOffset: 2,
          opacity: inactive ? 0.5 : state.pressed ? 0.8 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <>
          <View
            accessible={false}
            style={{
              width: 16,
              height: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {status === "complete" ? (
              <View
                style={{
                  width: 6,
                  height: 10,
                  marginTop: -3,
                  borderRightWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: theme.colors.mutedForeground,
                  transform: [{ rotate: "45deg" }],
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 11,
                  lineHeight: 16,
                  fontWeight: "500",
                  fontVariant: ["tabular-nums"],
                  fontFamily: theme.fonts?.mono,
                  color:
                    status === "current" ? theme.colors.foreground : theme.colors.mutedForeground,
                }}
              >
                {step}
              </Text>
            )}
          </View>
          <View style={{ flexShrink: 1 }}>
            {typeof children === "function" ? children(state) : children}
          </View>
        </>
      )}
    </Pressable>
  )
}
