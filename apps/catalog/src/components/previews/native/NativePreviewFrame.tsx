import { useEffect, useState, type ReactNode } from "react"
import { View } from "react-native"
import { NativeThemeProvider } from "../../../../../../generated/react-native/lib/theme"

const fonts = {
  regular: "Schibsted Grotesk Variable",
  medium: "Schibsted Grotesk Variable",
  semibold: "Schibsted Grotesk Variable",
  mono: "IBM Plex Mono",
}

export default function NativePreviewFrame({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light"
  )
  useEffect(() => {
    const update = () =>
      setMode(document.documentElement.dataset.theme === "dark" ? "dark" : "light")
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    return () => observer.disconnect()
  }, [])
  return (
    <NativeThemeProvider mode={mode} fonts={fonts}>
      <View
        testID="native-catalog"
        nativeID={`native-preview-${mode}`}
        style={{ padding: 16, gap: 16 }}
      >
        {children}
      </View>
    </NativeThemeProvider>
  )
}
