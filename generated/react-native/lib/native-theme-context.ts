import { createContext, useSyncExternalStore } from "react"
import { Appearance } from "react-native"
import type { NativeTheme } from "./native-tokens"

export const NativeThemeContext = createContext<NativeTheme | undefined>(undefined)

const noScheme = () => null
const noSubscription = () => () => {}
const getScheme = () => Appearance.getColorScheme()
const subscribe = (listener: () => void) => {
  const subscription = Appearance.addChangeListener(listener)
  return () => subscription.remove()
}

// A provider owns system appearance. Descendants with an inherited or explicit
// theme do not each subscribe to native appearance events.
export function useSystemColorScheme(enabled: boolean) {
  return useSyncExternalStore(
    enabled ? subscribe : noSubscription,
    enabled ? getScheme : noScheme,
    noScheme
  )
}
