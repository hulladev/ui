import { useContext, useMemo, type ReactNode } from "react"
import { NativeThemeContext, useSystemColorScheme } from "./native-theme-context"
import { nativeThemes, type NativeTheme } from "./native-tokens"

export type NativeThemeProviderProps = {
  children: ReactNode
  mode?: "system" | "light" | "dark"
  theme?: NativeTheme
  fonts?: NativeTheme["fonts"]
}

export function NativeThemeProvider({ children, mode, theme, fonts }: NativeThemeProviderProps) {
  const inherited = useContext(NativeThemeContext)
  const followsSystem = !theme && (mode === "system" || (!mode && !inherited))
  const scheme = useSystemColorScheme(followsSystem)
  const base: NativeTheme =
    theme ??
    (mode
      ? nativeThemes[mode === "system" ? (scheme === "dark" ? "dark" : "light") : mode]
      : (inherited ?? nativeThemes[scheme === "dark" ? "dark" : "light"]))
  const resolved = useMemo<NativeTheme>(() => {
    const inheritedFonts = inherited?.fonts
    if (!fonts && (!inheritedFonts || inheritedFonts === base.fonts)) return base
    return { ...base, fonts: { ...inheritedFonts, ...base.fonts, ...fonts } }
  }, [base, fonts, inherited?.fonts])
  return <NativeThemeContext value={resolved}>{children}</NativeThemeContext>
}
