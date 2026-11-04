import { useState } from "react"
import { useFonts } from "expo-font"
import { SchibstedGrotesk_400Regular } from "@expo-google-fonts/schibsted-grotesk/400Regular"
import { SchibstedGrotesk_500Medium } from "@expo-google-fonts/schibsted-grotesk/500Medium"
import { SchibstedGrotesk_600SemiBold } from "@expo-google-fonts/schibsted-grotesk/600SemiBold"
import { IBMPlexMono_400Regular } from "@expo-google-fonts/ibm-plex-mono/400Regular"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { ActivityIndicator } from "react-native"
import { StatusBar } from "expo-status-bar"
import {
  NativeThemeProvider,
  nativeThemes,
  useNativeTheme,
} from "../../generated/react-native/lib/theme"
import { Catalog } from "./src/Catalog"

const fonts = {
  regular: "SchibstedGrotesk_400Regular",
  medium: "SchibstedGrotesk_500Medium",
  semibold: "SchibstedGrotesk_600SemiBold",
  mono: "IBMPlexMono_400Regular",
}
type Mode = "system" | "light" | "dark"

function CatalogScreen({ mode, onModeChange }: { mode: Mode; onModeChange: (mode: Mode) => void }) {
  const theme = useNativeTheme()
  const dark = theme.colors.background === nativeThemes.dark.colors.background
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style={dark ? "light" : "dark"} />
        <Catalog mode={mode} onModeChange={onModeChange} />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default function App() {
  const [mode, setMode] = useState<Mode>("system")
  const [loaded, error] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_600SemiBold,
    IBMPlexMono_400Regular,
  })
  if (!loaded && !error) return <ActivityIndicator accessibilityLabel="Loading catalog fonts" />
  return (
    <NativeThemeProvider mode={mode} fonts={loaded ? fonts : undefined}>
      <CatalogScreen mode={mode} onModeChange={setMode} />
    </NativeThemeProvider>
  )
}
