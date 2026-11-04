import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { Appearance } from "react-native"
import { isDark } from "@hulla/style-native/color"
import { nativeThemes, type NativeTheme } from "./tokens.react-native"

export { nativeThemes, type NativeTheme } from "./tokens.react-native"

const ThemeContext = createContext<NativeTheme | undefined>(undefined)
const noScheme = () => null
const noSubscription = () => () => {}
const getScheme = () => Appearance.getColorScheme()
const subscribe = (listener: () => void) => {
  const subscription = Appearance.addChangeListener(listener)
  return () => subscription.remove()
}

// Inherited or explicit nativeThemes do not add per-component appearance subscriptions.
function useSystemColorScheme(enabled: boolean) {
  return useSyncExternalStore(
    enabled ? subscribe : noSubscription,
    enabled ? getScheme : noScheme,
    noScheme
  )
}

type ResolvedTheme = NativeTheme & { mode: "light" | "dark" }
const resolvedThemes = new WeakMap<NativeTheme, ResolvedTheme>()

// Themes are immutable configuration values. Replacing the object resolves a new palette.
function resolveTheme(theme: NativeTheme): ResolvedTheme {
  if (theme.mode) return theme as ResolvedTheme
  const cached = resolvedThemes.get(theme)
  if (cached) return cached
  const resolved = {
    ...theme,
    mode: isDark(theme.colors.background) ? ("dark" as const) : ("light" as const),
  }
  resolvedThemes.set(theme, resolved)
  return resolved
}

export function useNativeTheme(theme?: NativeTheme): ResolvedTheme {
  const inherited = useContext(ThemeContext)
  const scheme = useSystemColorScheme(!theme && !inherited)
  return resolveTheme(theme ?? inherited ?? nativeThemes[scheme === "dark" ? "dark" : "light"])
}

export type NativeThemeProviderProps = {
  children: ReactNode
  mode?: "system" | "light" | "dark"
  theme?: NativeTheme
  fonts?: NativeTheme["fonts"]
}

export function NativeThemeProvider({ children, mode, theme, fonts }: NativeThemeProviderProps) {
  const inherited = useContext(ThemeContext)
  const followsSystem = !theme && (mode === "system" || (!mode && !inherited))
  const scheme = useSystemColorScheme(followsSystem)
  const base = resolveTheme(
    theme ??
      (mode
        ? nativeThemes[mode === "system" ? (scheme === "dark" ? "dark" : "light") : mode]
        : (inherited ?? nativeThemes[scheme === "dark" ? "dark" : "light"]))
  )
  const resolved = useMemo(() => {
    const inheritedFonts = inherited?.fonts
    if (!fonts && (!inheritedFonts || inheritedFonts === base.fonts)) return base
    return { ...base, fonts: { ...inheritedFonts, ...base.fonts, ...fonts } }
  }, [base, fonts, inherited?.fonts])
  return <ThemeContext value={resolved}>{children}</ThemeContext>
}
