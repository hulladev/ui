import { lazy, Suspense, useEffect, useState } from "react"
import { BackHandler, Platform, Pressable, ScrollView, View } from "react-native"
import { Text } from "../../../generated/react-native/typography"
import { Switch } from "../../../generated/react-native/switch"
import { Button, ButtonText } from "../../../generated/react-native/button"
import { Spinner } from "../../../generated/react-native/spinner"
import { nativeThemes, useNativeTheme } from "../../../generated/react-native/lib/native-theme"
import { nativeCatalogEntries, type NativeCatalogId } from "./entries"

const examples = {
  typography: lazy(() => import("./examples/TypographyExample")),
  button: lazy(() => import("./examples/ButtonExample")),
  input: lazy(() => import("./examples/InputExample")),
  textarea: lazy(() => import("./examples/TextareaExample")),
  field: lazy(() => import("./examples/FieldExample")),
  checkbox: lazy(() => import("./examples/CheckboxExample")),
  switch: lazy(() => import("./examples/SwitchExample")),
  "number-field": lazy(() => import("./examples/NumberFieldExample")),
  "tag-input": lazy(() => import("./examples/TagInputExample")),
  "file-upload": lazy(() => import("./examples/FileUploadExample")),
  card: lazy(() => import("./examples/CardExample")),
  dialog: lazy(() => import("./examples/DialogExample")),
  drawer: lazy(() => import("./examples/DrawerExample")),
  spinner: lazy(() => import("./examples/SpinnerExample")),
  "keyboard-aware": lazy(() => import("./examples/KeyboardAwareExample")),
}

export function Catalog({
  mode,
  onModeChange,
}: {
  mode: "system" | "light" | "dark"
  onModeChange: (mode: "system" | "light" | "dark") => void
}) {
  const theme = useNativeTheme()
  const [selected, setSelected] = useState<NativeCatalogId | null>(null)
  useEffect(() => {
    if (!selected || Platform.OS !== "android") return
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      setSelected(null)
      return true
    })
    return () => subscription.remove()
  }, [selected])
  const dark =
    mode === "dark" ||
    (mode === "system" && theme.colors.background === nativeThemes.dark.colors.background)
  const entry = nativeCatalogEntries.find((entry) => entry.id === selected)
  const Example = selected ? examples[selected] : null
  return (
    <ScrollView
      key={selected ?? "index"}
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        padding: 16,
        gap: 24,
        width: "100%",
        maxWidth: 960,
        alignSelf: "center",
      }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={selected !== "keyboard-aware"}
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
    >
      <Text variant="caption" tone="muted">
        @hulla/ui · React Native
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 }}>
        <Switch
          accessibilityLabel="Dark theme"
          value={dark}
          onValueChange={(value) => onModeChange(value ? "dark" : "light")}
        />
        <Text>Dark theme</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => onModeChange("system")}
          style={{ minHeight: 48, justifyContent: "center" }}
        >
          <Text variant="caption" tone="muted">
            Use device theme
          </Text>
        </Pressable>
      </View>
      {entry && Example ? (
        <>
          <Button
            variant="ghost"
            onPress={() => setSelected(null)}
            accessibilityLabel="All components"
          >
            <ButtonText variant="ghost">All components</ButtonText>
          </Button>
          <View style={{ gap: 6 }}>
            <Text variant="heading">{entry.title}</Text>
            <Text tone="muted">{entry.description}</Text>
          </View>
          <Suspense fallback={<Spinner accessibilityLabel="Loading component" />}>
            <Example key={entry.id} />
          </Suspense>
        </>
      ) : (
        <>
          <View style={{ gap: 6 }}>
            <Text variant="heading">Component catalog</Text>
            <Text tone="muted">
              {nativeCatalogEntries.length} families. Choose a component to explore its native
              behavior.
            </Text>
          </View>
          <View>
            {nativeCatalogEntries.map((entry) => (
              <Pressable
                key={entry.id}
                accessibilityRole="button"
                accessibilityLabel={entry.title}
                accessibilityHint={entry.description}
                onPress={() => setSelected(entry.id)}
                style={{
                  minHeight: 64,
                  justifyContent: "center",
                  gap: 4,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text>{entry.title}</Text>
                <Text variant="caption" tone="muted">
                  {entry.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}
