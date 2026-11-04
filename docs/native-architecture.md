# Native architecture and coverage

## Catalog coverage

The native registry contains 48 families, each with a separate Expo example, browser preview,
and generated source view. The Expo index lazy-loads one detail example at a time. In the browser,
shared families appear beside web implementations in their existing component sections. Choosing
React Native in that component's framework picker mounts its native preview on demand and selects
its generated and rendered source. Other native examples stay unmounted.

The browser's Native only section contains the five families whose generated manifest lists only
`react-native`: EmptyState, KeyboardAware, List, NumberField, and SwipeActions. These retain dedicated
pages under `/react-native`; shared-family routes such as `/react-native/card` lead to the existing
Card section with `framework=react-native` selected. The Expo index still lists all 48 families.

Rendered native source comes from the actual example, browser wrapper, theme frame, and preview
runtime. FileUpload also includes its device and browser document-picker adapters. Raw source is
read by Astro on the server, while executable native previews load only when selected. This is
broad catalog coverage; a browser preview and successful native bundle do not certify device
accessibility or performance for every composition.

| Area                      | Families                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Foundations               | Typography, Button, Badge, Separator, Spinner                                                                        |
| Forms                     | Input, Textarea, Field, Checkbox, Radio, Switch, Toggle, Select, Combobox, Slider, NumberField, TagInput, FileUpload |
| Date and time             | Calendar, DatePicker, TimePicker                                                                                     |
| Content                   | Card, LinkCard, List, Avatar, EmptyState, Table, Code                                                                |
| Navigation and disclosure | Accordion, Collapsible, Tabs, Stepper, Breadcrumbs, Pagination, TreeView                                             |
| Overlays and help         | Dialog, Drawer, DropdownMenu, Popover, Tooltip, Command                                                              |
| Feedback                  | Alert, Toast, Progress, Meter, Skeleton                                                                              |
| Native compositions       | SwipeActions, KeyboardAware                                                                                          |

Native interactions differ deliberately from web: Tooltip exposes visible tap help; Popover uses
an accessible modal rather than claiming anchored positioning; choice and action menus use sheets.
Table presents horizontally scrollable data with explicit accessible row summaries. TreeView uses
ordinary hierarchical disclosure buttons, not a desktop ARIA tree. Tabs and Radio keep selection
explicit; their examples show consumer-owned browser roving focus and relationships.

Desktop-oriented Sidebar and NavigationMenu are represented by Drawer/List compositions rather
than fixed phone sidebars or hover navigation. HoverCard uses the visible help/Popover patterns.
Backdrop is owned by Dialog/Drawer. Kbd, pointer-resizable panes, document TableOfContents, and
syntax-highlighter integrations do not claim native implementations. Generic drag/reorder is not
provided by SwipeActions: swipes reveal actions, and a visible button provides the same route.

All interactive targets reserve at least 48 logical units. SwipeActions only captures horizontal
movement after a threshold, leaves vertical scrolling available, changes state only after release,
and never executes an action directly. Slider supports horizontal gestures, keyboard bounds, and
native accessibility increment/decrement actions; cancellation restores the starting value.

Document picking belongs to the host app. FileUpload supplies composable attachment parts; the
catalog integrates Expo DocumentPicker on devices and a real file chooser in the browser without
adding Expo to installed component dependencies. Files are displayed locally and are not uploaded.

Dialog and Drawer preserve core Modal props and dismissal callbacks. React Native Web supplies
its modal focus scope; native focus and announcements follow the host Modal/accessibility APIs.
Toast pauses for interaction and keeps notices open when a screen reader is active. KeyboardAware
preserves KeyboardAvoidingView configuration; avoid combining duplicate keyboard inset adjustments.

## Application theming

`NativeThemeProvider` configures mode, fonts, or a custom palette at the application boundary.
Descendants call `useNativeTheme()` internally and inherit the nearest provider. Consumers do not
thread theme props through the component tree. Nested providers support scopes; per-component
`theme` remains an optional escape hatch. Font overrides merge with inherited fonts.

Only boundaries following system appearance subscribe to appearance events. Components inheriting
a theme do not create their own appearance subscriptions. Resolved provider values are memoized.
Theme changes still re-render theme consumers; this is not a zero-render styling engine.

Theme propagation is app configuration. It does not implicitly propagate disabled/invalid state,
form associations, or variant selection through arbitrary children.

## Styling backend

Native style objects are a valid rendering baseline. `StyleSheet.create` is currently an identity
function whose main documented benefit is type checking. Stable style references and appropriate
rendering boundaries matter; wrapping objects in `StyleSheet.create` alone is not a performance
optimization. Do not claim a faster backend without measuring representative release builds.

NativeWind adds utility-class authoring, compilation, and runtime conditional-style resolution.
It can align authoring with the web targets, but it does not supply component behavior or guarantee
better runtime performance. Its stable v4 targets Tailwind 3; its Tailwind 4 v5 is a release candidate.
The documented RC validation target is Expo SDK 57, while this catalog uses SDK 58. Compatibility
must be checked in the actual native and browser catalog pipelines before making it the default.
NativeWind's default native rem base also differs from web, so density needs explicit configuration.

A useful backend evaluation should cover a composed form, a long selectable list, an animated
sheet, scoped/system theme changes, custom fonts, and source-registry installation. Verify iOS,
Android, and the Astro React Native Web preview. Compare readability, setup requirements, bundle
cost, render/scroll behavior, and customization; do not adopt a synthetic vendor benchmark as an
application performance guarantee.

Unistyles is another option for typed theme-aware styles and native updates. It includes native
code and requires a development build, so it changes the existing Expo Go workflow.

## Role of `@hulla/style`

`style(native)` composes native style objects and variants through the existing core factory.
The root preset in `@hulla/style-native` has no runtime imports; it keeps native style arrays,
references, and override order. It does not supply theme propagation or a CSS runtime.

Native UI components depend on the separate `@hulla/style-native/color` entry point (1.1.0 or
later) for opacity and premultiplied OKLab mixing. Its bounded result caches reuse repeated
recipes. Built-in themes declare light/dark mode explicitly. Custom palettes can declare mode;
without it, background lightness is resolved once per immutable theme object.
Replace a theme object when changing its configuration.

The registry authors support files as `theme.react-native.tsx`, `tokens.react-native.ts`,
`date.react-native.ts`, and `text-input-style.react-native.ts`. Their emitted paths omit the
framework suffix. Initialization installs only theme and tokens. Date and text-entry helpers
are marked `onDemand`; the generator follows emitted relative and `@/` imports, type imports,
and transitive support dependencies to derive component consumers. The CLI installs those
helpers when the corresponding component is added, preserving existing edited helpers.

Theme resolution stays in `NativeThemeProvider` / `useNativeTheme()`, with fonts and scoped overrides.
The adapter guide lives in `style/packages/native/README.md` in the sibling workspace.

## Primary references

- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
- [NativeWind v4 installation](https://www.nativewind.dev/docs/getting-started/installation)
- [NativeWind v5 overview](https://www.nativewind.dev/v5)
- [NativeWind v5 installation and validated versions](https://www.nativewind.dev/v5/getting-started/installation)
- [NativeWind units and rem sizing](https://www.nativewind.dev/v5/core-concepts/units)
- [Unistyles requirements](https://unistyl.es/v3/start/getting-started/)
