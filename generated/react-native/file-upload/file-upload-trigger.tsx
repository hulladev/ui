import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { alpha } from "@hulla/style-native/color"
export type FileUploadTriggerProps = ComponentPropsWithRef<typeof Pressable> & {
  theme?: NativeTheme
  contentStyle?: ComponentPropsWithRef<typeof Pressable>["style"]
}
export function FileUploadTrigger({
  children,
  style,
  contentStyle,
  theme: override,
  disabled,
  accessibilityState,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  ...props
}: FileUploadTriggerProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      disabled={inactive}
      aria-disabled={inactive}
      aria-busy={props["aria-busy"] ?? accessibilityState?.busy}
      accessibilityState={{ ...accessibilityState, disabled: inactive }}
      onHoverIn={(event) => {
        setHovered(true)
        onHoverIn?.(event)
      }}
      onHoverOut={(event) => {
        setHovered(false)
        onHoverOut?.(event)
      }}
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
          justifyContent: "flex-start",
          padding: 6,
          gap: 12,
          borderWidth: 1,
          borderColor: inactive ? theme.colors.disabledBorder : theme.colors.border,
          borderRadius: theme.radius.md,
          backgroundColor: inactive ? theme.colors.disabledSurface : theme.colors.surface,
          outlineWidth: focused && !inactive ? 2 : 0,
          boxShadow: inactive
            ? undefined
            : [{ offsetX: 0, offsetY: 1, blurRadius: 2, color: "#0000000d" }],
          outlineOffset: 2,
          outlineColor: theme.colors.focusRing,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="file-upload-chooser-surface"
          style={[
            {
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: theme.radius.sm,
              backgroundColor:
                !inactive && (hovered || state.pressed)
                  ? theme.colors.hoverSurface
                  : alpha(theme.colors.foreground, 0.05),
            },
            typeof contentStyle === "function" ? contentStyle(state) : contentStyle,
          ]}
        >
          {typeof children === "function" ? children(state) : children}
        </View>
      )}
    </Pressable>
  )
}
