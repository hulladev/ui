import { useMemo, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react"
import { PanResponder, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { Button } from "../button/button.react-native"
import { ButtonText } from "../button/button-text.react-native"

export type SwipeActionsProps = ComponentPropsWithRef<typeof View> & {
  actions: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  actionLabel?: string
  theme?: NativeTheme
}

export function SwipeActions({
  children,
  style,
  actions,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  actionLabel = "Row actions",
  theme: override,
  ...props
}: SwipeActionsProps) {
  const theme = useNativeTheme(override)
  const [local, setLocal] = useState(defaultOpen)
  const expanded = open ?? local
  // Stable responder callbacks read current props without rebuilding the responder mid-gesture.
  const current = useRef({ expanded, open, onOpenChange, disabled })
  current.current = { expanded, open, onOpenChange, disabled }
  const change = (next: boolean) => {
    if (current.current.disabled) return
    if (current.current.open === undefined) setLocal(next)
    current.current.onOpenChange?.(next)
  }
  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          !current.current.disabled &&
          Math.abs(gesture.dx) > 16 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
        onPanResponderRelease: (_, gesture) => {
          if (Math.abs(gesture.dx) >= 48 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5)
            change(gesture.dx < 0)
        },
        onPanResponderTerminationRequest: () => true,
        // Cancellation never changes visibility or executes an action.
        onPanResponderTerminate: () => {},
      }),
    []
  )
  return (
    <View {...props} {...responder.panHandlers} style={[{ gap: 8 }, style]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
        <Button
          theme={theme}
          variant="ghost"
          disabled={disabled}
          accessibilityLabel={actionLabel}
          accessibilityState={{ expanded, disabled }}
          aria-expanded={expanded}
          onPress={() => change(!expanded)}
        >
          <ButtonText theme={theme} variant="ghost" disabled={disabled}>
            {expanded ? "Close" : "Actions"}
          </ButtonText>
        </Button>
      </View>
      {expanded && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{actions}</View>
      )}
    </View>
  )
}
