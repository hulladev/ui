# Platform design for `@hulla/ui`

The web and React Native targets share a design language. Each target owns its platform semantics,
interaction contract, and implementation. Components may share an intent while differing in
presentation, props, dimensions, or availability.

## Visual continuity

For an existing web counterpart, start from its canonical component and recipe in `src/react`
and `src/+css`. Shared colors alone do not establish visual continuity. Preserve the surface
hierarchy, borders, elevation, radii, typography, tracking, and selected-state treatment. A web
component with plain neighbors and an inverted selection must not become a set of outlined blue
controls on native. A borderless navigation row must not acquire a card shell.

Translate the painted component first, then reserve its touch region separately. The native
pagination paints the web's 36-unit item inside a 48-unit target; buttons paint 32 units. Menu rows
retain their compact web paint inside taller native targets. Core platform controls, modal/sheet
presentation, text scaling, and native line boxes can differ deliberately. For example, native
table headers retain a 13/20 text grid rather than the web's inherited fractional line height.

Native text does not inherit styles through arbitrary views. Use explicit text parts for variants,
selection, and disabled colors, such as `PaginationItemText`, `ToggleText`, and `SelectItemText`.
Keep their state explicit rather than walking children or propagating native attributes through
context. `style` continues to customize the host; components separating touch and painted bounds
expose `contentStyle` for the painted surface.
Date and time triggers reuse the selection-field treatment; `Select.indicator` lets these
compositions supply their calendar or clock indicator without changing the field recipe.

Opacity and mixed surfaces use the same semantic palette and premultiplied OKLab mixing through
the small native color helper. This also preserves named and RGB colors in custom palettes through
React Native's color parser; it introduces no styling-engine dependency.

Web glass combines transparency with backdrop blur. Core React Native has no equivalent without
an additional native dependency. Dialog, popover, and toast surfaces therefore use opaque raised
fills (including their semantic tint) on native, so background text cannot bleed through them.
The React Native Web preview uses the same fallback. Ordinary alpha-tinted states within a solid
surface still follow the web recipe. Add a host blur surface explicitly when the application needs it.

The `native-*-language.spec.ts` browser suites compare actual web and native component paint,
typography, geometry, and state. Keep these comparisons alongside native interaction checks and
catalog CSS isolation. The isolation check alone cannot detect drift between platform recipes;
its margin checks also prevent catalog resets from hiding a shipping component's spacing.

## Catalog organization

A shared component has one browser catalog entry. Its framework picker offers React Native beside
its web implementations when that target exists in the registry. Native previews mount on demand
when selected, using the same theme and source controls; do not mount all native examples on the
page behind hidden panels. Rendered source must show the actual example and the adapter files that
produce that preview.

Reserve the Native only section for families whose generated manifest lists only `react-native`.
Keep platform availability separate from interaction choice: a shared Tooltip can have a visible
native help trigger while remaining beside the web Tooltip entry. The Expo catalog keeps its own
complete family index for device review.

## Sizing and density

The native target shares semantic colors and radii through `theme.json`. Control recipes remain platform-specific; compact visual sizes follow the web scale while native controls preserve room for touch and system text scaling.

Current defaults, with a 16px web root font size and default native text scaling:

| Measurement               | Web         | React Native              |
| ------------------------- | ----------- | ------------------------- |
| Button painted height     | 32px (`md`) | At least 32 logical units |
| Button label size         | 14px        | 14 logical units          |
| Button horizontal padding | 12px        | 12 logical units          |
| Single-line input height  | 40px (`md`) | At least 48 logical units |
| Input label/text size     | 14px        | 14 logical units          |
| Input horizontal padding  | 12px        | 12 logical units          |

Native buttons reserve at least 48 × 48 logical units for the Pressable and paint a compact surface inside it. `style` controls the press region and layout; `contentStyle` controls the painted surface and supports the same pressed-state callback. Native inputs retain their 48-unit editing surface with compact text and padding.

Native logical units are not physical screen pixels. React Native Web renders the native target's
definitions, including its reserved touch space; compare painted surfaces separately from hit regions.

Use a common spacing and typography vocabulary, with deliberate platform mappings. Document what
a component's size means on each target rather than assuming that matching names imply identical
dimensions. Do not add a broad size matrix before the actual compositions demonstrate a need.

Review three measurements separately: the painted control, the space reserved in layout, and the
hit region. A compact visual treatment can have a larger touch target when the surrounding layout
reserves sufficient space. Enlarging an invisible hit region must not create overlapping actions or
depend on areas outside its parent's bounds. `hitSlop` is an implementation option, not a substitute
for a usable layout.

Apple recommends a hit region of at least 44 × 44pt for buttons; Android recommends touch targets of
at least 48 × 48dp. These recommendations concern interactive targets and do not require every
visible surface to use the same dimensions. Keep text scaling enabled and allow controls to grow.

Sources: [Apple buttons](https://developer.apple.com/design/human-interface-guidelines/buttons),
[Android touch targets](https://support.google.com/accessibility/android/answer/7101858), and
[React Native Pressable hit regions](https://reactnative.dev/docs/pressable#hitslop).

## Interaction follows purpose and input

The following are design directions for future components, not implemented native APIs.

| Purpose                      | Web pattern                         | Native direction                                                                                                                                             |
| ---------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Supplementary help           | Tooltip on hover and keyboard focus | A visible info button or clearly marked help text opens a brief explanation on tap; use a disclosure, popover, or sheet when the content needs that behavior |
| Contextual actions           | Menu button or context menu         | A visible action/overflow button; long press may provide a shortcut                                                                                          |
| Repeated row actions         | Inline buttons or overflow menu     | Swipe actions where appropriate, with an explicit action route and screen-reader actions                                                                     |
| Moving or reordering content | Pointer drag with keyboard support  | A discoverable handle and gesture behavior that coexists with scrolling, plus an accessible alternative                                                      |
| Choosing an option           | Select or anchored listbox          | A platform picker, selection sheet, or anchored choice surface according to the task                                                                         |
| Modal work                   | Dialog or drawer                    | A modal or sheet chosen for the task, with explicit dismissal and back behavior                                                                              |

An underline used for help must communicate a different purpose from a navigation link. An info
icon needs an accessible name and a usable hit region. Essential instructions belong inline or
behind an obvious control; they must not be discoverable only through hover, long press, or swipe.

Choose names and APIs that describe the resulting behavior. Turning a tooltip into a sheet with
interactive content may justify a different component or composition. Do not force that interaction
into a tooltip contract to preserve a name across platforms.

For gestures, define the activation threshold, scrolling conflicts, cancellation, action feedback,
and accessible alternative. Avoid accidental destructive activation; choose confirmation or undo
according to the action's consequences.

## Platform-specific components are first-class

A native target can offer a swipe-action row or keyboard-aware layout without a web counterpart.
A web target can retain pointer-oriented components without a native counterpart. Reuse lower-level
parts when their semantics match, and keep each target's native props and styling escape hatch.

Before adding a target for a component, decide its purpose, discoverable trigger, presentation,
dismissal, state ownership, and accessibility behavior. The registry and catalog must report actual
availability. A browser preview of the native implementation helps visual review; touch, keyboard,
screen-reader, and system behavior still need appropriate platform verification.
