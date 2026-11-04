// Generated from theme.json. Run bun run generate to update.
// sRGB colors work on both React Native platforms without CSS or a styling runtime.
export const nativeThemes = {
  light: {
    mode: "light",
    colors: {
      background: "#f3faff",
      surface: "#fcfeff",
      surfaceRaised: "#fff",
      foreground: "#050c1e",
      mutedForeground: "#445469",
      prose: "#21293c",
      border: "#050c1e24",
      primary: "#2258e5",
      primaryText: "#2258e5",
      primaryForeground: "#f9fcff",
      focusRing: "#1d4abd",
      success: "#17843f",
      warning: "#daad46",
      danger: "#c83a35",
      onEmphasis: "#f9fcff",
      disabledForeground: "#445469bf",
      disabledSurface: "#050c1e09",
      disabledBorder: "#050c1e14",
      hoverSurface: "#050c1e14",
      selectedSurface: "#2258e519",
      selectedHoverSurface: "#2258e529",
    },
    radius: {
      sm: 7,
      md: 11,
      lg: 16,
    },
  },
  dark: {
    mode: "dark",
    colors: {
      background: "#040404",
      surface: "#0a0a0a",
      surfaceRaised: "#141414",
      foreground: "#f5f5f5",
      mutedForeground: "#9e9e9e",
      prose: "#cacaca",
      border: "#f5f5f524",
      primary: "#2258e5",
      primaryText: "#7ea4f1",
      primaryForeground: "#f5f5f5",
      focusRing: "#5e8cf0",
      success: "#6ebb8b",
      warning: "#dbaa64",
      danger: "#f36069",
      onEmphasis: "#f9fcff",
      disabledForeground: "#9e9e9ebf",
      disabledSurface: "#f5f5f509",
      disabledBorder: "#f5f5f514",
      hoverSurface: "#f5f5f51f",
      selectedSurface: "#2258e52e",
      selectedHoverSurface: "#2258e542",
    },
    radius: {
      sm: 7,
      md: 11,
      lg: 16,
    },
  },
} satisfies Record<
  "light" | "dark",
  { mode: "light" | "dark"; colors: Record<string, string>; radius: Record<string, number> }
>

export type NativeTheme = Omit<typeof nativeThemes.light, "mode"> & {
  mode?: "light" | "dark"
  fonts?: Partial<Record<"regular" | "medium" | "semibold" | "mono", string>>
}
