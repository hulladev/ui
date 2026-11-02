import { useContext } from "react"
import { NativeThemeContext, useSystemColorScheme } from "./native-theme-context"
import { nativeThemes, type NativeTheme } from "./native-tokens"

export { nativeThemes, type NativeTheme } from "./native-tokens"
export { NativeThemeProvider, type NativeThemeProviderProps } from "./native-theme-provider"

export function useNativeTheme(theme?: NativeTheme): NativeTheme {
  const inherited = useContext(NativeThemeContext)
  const scheme = useSystemColorScheme(!theme && !inherited)
  return theme ?? inherited ?? nativeThemes[scheme === "dark" ? "dark" : "light"]
}
