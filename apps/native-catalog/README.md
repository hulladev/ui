# @hulla/ui native catalog

An Expo component catalog consuming the real generated `react-native` registry output.

From the repository root:

```sh
bun install
bun run generate
bun run dev:native
```

Open the QR code in Expo Go, or press `i` / `a` for an installed iOS simulator / Android emulator.
Press `w` for React Native Web. `bun run --cwd apps/native-catalog build` verifies a standalone web
export. In the Astro catalog, shared components expose **React Native** beside the other frameworks
in their usual section, for example `/forms?framework=react-native#input`. Selecting that framework
loads the matching file from `src/examples`; inactive native examples remain unmounted. Generated
source and rendered source use the same component entry. Existing shared routes such as
`/react-native/button` lead to the corresponding section.

The browser's **Native only** section at `/react-native` contains EmptyState, KeyboardAware, List,
NumberField, and SwipeActions. Registry framework availability determines this list. The Expo app
retains all 48 families, opens on its component index, and mounts only the selected detail example;
All components and Android back return to the index.

The catalog contains 48 families with light/dark/device themes. The index lazy-loads one example
at a time, keeping review and source files separate. Core forms, date/time, content, navigation,
overlays, feedback, and native swipe/keyboard compositions use the same semantic theme.

Buttons paint compact 32-unit surfaces inside 48-unit targets; checkbox indicators remain18 units.
Fields, tabs, radio groups, and disclosure parts keep their state and associations explicit.
Document picking integrates Expo DocumentPicker in the app; installed FileUpload components have no
Expo dependency. The browser adapter opens a real file chooser. Nothing uploads automatically.

See [coverage and platform contracts](../../docs/native-architecture.md) for mobile alternatives to
desktop-only patterns and the limits of browser previews.

React Native Web supports pointer, Space, and Enter activation for the checkbox. Native editing,
keyboard behavior, screen-reader hints, and text scaling use the underlying React Native elements.
Native field labels use explicit accessibilityLabel / accessibilityLabelledBy and accessibilityHint
props on the control; labels and descriptions alone do not create those relationships. Font loading belongs
to the host application; the shared components remain independent of Expo.
