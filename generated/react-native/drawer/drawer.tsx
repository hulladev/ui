import type { ComponentPropsWithRef } from "react"
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { alpha } from "@hulla/style-native/color"
export type DrawerProps = ComponentPropsWithRef<typeof Modal> & {
  onClose: () => void
  contentStyle?: ComponentPropsWithRef<typeof View>["style"]
  /** Styles the scrollable content layout separately from the modal surface. */
  contentContainerStyle?: ComponentPropsWithRef<typeof ScrollView>["contentContainerStyle"]
  contentLabel: string
  dismissOnBackdropPress?: boolean
  theme?: NativeTheme
}
export function Drawer({
  children,
  onClose,
  contentStyle,
  contentContainerStyle,
  contentLabel,
  dismissOnBackdropPress = true,
  theme: override,
  onRequestClose,
  onAccessibilityEscape,
  ...props
}: DrawerProps) {
  const theme = useNativeTheme(override)
  return (
    <Modal
      transparent
      accessibilityLabel={contentLabel}
      animationType="none"
      {...props}
      onRequestClose={onRequestClose ?? onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end", padding: 0 }}
      >
        <Pressable
          accessible={false}
          tabIndex={-1}
          focusable={false}
          importantForAccessibility="no"
          testID="drawer-backdrop"
          onPress={() => {
            if (dismissOnBackdropPress) onClose()
          }}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor:
              theme.mode === "dark"
                ? alpha(theme.colors.background, 0.72)
                : alpha(theme.colors.foreground, 0.4),
          }}
        />
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onAccessibilityEscape ?? onClose}
          accessibilityLabel={contentLabel}
          testID="drawer-content"
          style={[
            {
              width: "100%",
              maxWidth: "100%",
              maxHeight: "90%",
              alignSelf: "center",
              backgroundColor: theme.colors.surfaceRaised,
              borderTopWidth: 1,
              borderColor:
                theme.mode === "dark" ? alpha(theme.colors.foreground, 0.15) : theme.colors.border,
              boxShadow:
                theme.mode === "dark"
                  ? "0 2px 4px -2px rgba(0,0,0,0.28), 0 24px 80px -28px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "0 2px 4px -2px rgba(0,0,0,0.12), 0 24px 80px -28px rgba(0,0,0,0.28)",
              borderRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            contentStyle,
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              { padding: 24, paddingBottom: 32, gap: 24 },
              contentContainerStyle,
            ]}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
