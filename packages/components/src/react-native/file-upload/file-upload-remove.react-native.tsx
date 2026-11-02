import { useState, type ComponentPropsWithRef } from "react"
import { Pressable, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type FileUploadRemoveProps = ComponentPropsWithRef<typeof Pressable> & {
  theme?: NativeTheme
  contentStyle?: ComponentPropsWithRef<typeof Pressable>["style"]
}
export function FileUploadRemove({
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
}: FileUploadRemoveProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const inactive = Boolean(disabled || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Remove attachment"
      {...props}
      disabled={inactive}
      aria-disabled={inactive}
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
          alignItems: "center",
          justifyContent: "center",
          outlineWidth: 0,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {(state) => (
        <View
          testID="file-upload-remove-surface"
          style={[
            {
              minHeight: 32,
              minWidth: 32,
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderWidth: 1,
              borderColor: "transparent",
              borderRadius: theme.radius.sm,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                !inactive && (hovered || state.pressed) ? theme.colors.hoverSurface : "transparent",
              outlineWidth: focused && !inactive ? 2 : 0,
              outlineOffset: 2,
              outlineColor: theme.colors.focusRing,
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
