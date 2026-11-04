# @hulla/ui

## 0.2.1

### Patch Changes

- 0d0dd7b: Lead the packaged README with application component-discovery commands and link to consumer and generator documentation.

## 0.2.0

### Minor Changes

- Generate framework-suffixed native support sources as plain application paths, use @hulla/style-native/color for shared color operations, and derive component consumers for on-demand support files. Native theme setup retains NativeThemeProvider and useNativeTheme, with editable tokens and explicit resolved modes.

## 0.1.1

### Patch Changes

- c4e8776: Normalize published package metadata and introduce coordinated release preparation with verified npm artifacts. GitHub Release announcements remain disabled by default.
- a5d61c9: Use the coordinated stable `@hulla/style` release in generated component dependencies.

## 0.1.0

### Minor Changes

- Publish the first stable generator release and align the source registry at
  0.1.0. Use a guarded latest-channel release workflow after exiting Changesets
  prerelease mode.

### Patch Changes

- 8ddf5bb: Use right-facing disclosure chevrons when collapsible and sidebar sections are closed, rotating them
  downward when the sections open.
- 85a5d82: Keep multiline sidebar disclosure headings compact with balanced wrapping, consistent vertical
  padding, and icons that retain their size across Astro, React, and Solid.
- 055b9f9: Make code-line emphasis more restrained and add syntax-aware Shiki diff highlighting that preserves
  the source language's token colors on inserted and deleted lines.
- 0ee2fa8: Animate native collapsibles only on summary activation so initial rendering, restored open state,
  and remounts appear instantly across Astro, React, and Solid.
- da3bbd7: Expand the native registry to 48 component families, including selection, date/time
  entry, content, navigation, feedback, modal surfaces, discoverable help, attachment
  composition, and native swipe/keyboard patterns. Keep state and native accessibility
  relationships explicit and inherit theme configuration from the existing provider.

  Add isolated source-backed Expo/browser examples for every family, native platform
  availability notes, and interaction/accessibility checks across browser engines,
  themes, and viewport sizes. Keep document picking in the host app rather than adding
  an Expo dependency to installed component sources.

- da3bbd7: Expand the native registry with Field parts, a multiline Textarea, a Checkbox with
  checked/mixed and disabled states, and composable Card parts. Text entry supports
  explicit invalid styling and shares a native style recipe through installed support
  files. Native field associations and hints remain explicit consumer composition.

  Add separate browser and Expo examples for the new families, and move Expo browsing
  to a component index and focused detail screen with Android back handling.

- da3bbd7: Publish emitted source paths for relocated support files so registry consumers can install them.
  The official registry adds a React Native target with shared web/native theme generation and an
  Expo component catalog.
- da3bbd7: Align native components with their canonical web visual recipes: preserve compact painted
  surfaces, neutral and inverted selection treatments, typography, borders, radii, and elevation
  while retaining native touch regions and interaction patterns.

  Add explicit native label/content parts for state styling, shared native opacity and OKLab color
  mixing support, and rendered web/native comparison checks. Correct the catalog paragraph reset
  and extend catalog isolation checks to cover component margins.

- 05178d8: Add an ordered, non-interactive Stepper variant with a rich StepperPanel for instructions, setup
  flows, and other fixed reading sequences.
- f12cccd: Rebuild the generator around deterministic full-tree staging, atomic output replacement, AST-based
  source transforms, validated path boundaries, standalone generated framework configs, a content
  manifest, check mode, and a production CLI/package surface. The legacy cache, lifecycle shell
  hooks, and install-command configuration are removed. Registry copy entries can explicitly mark a
  global stylesheet for consumer activation, and the official beta registry advertises only its
  verified Astro, React, and Solid targets.
- 05178d8: Use 16px body text, a 28px line height, foreground contrast, and 16px gaps in StepperPanel with no extra padding below step headings so ordered instructions remain comfortable to read alongside longer documentation.
- 79de51b: Improve `TableOfContents` active-section tracking for mixed-height content by scoring vertical
  viewport intersection with a leading-edge reading bias.

## 0.0.2-beta.1

### Patch Changes

- 8ddf5bb: Use right-facing disclosure chevrons when collapsible and sidebar sections are closed, rotating them
  downward when the sections open.
- 85a5d82: Keep multiline sidebar disclosure headings compact with balanced wrapping, consistent vertical
  padding, and icons that retain their size across Astro, React, and Solid.
- 055b9f9: Make code-line emphasis more restrained and add syntax-aware Shiki diff highlighting that preserves
  the source language's token colors on inserted and deleted lines.
- 0ee2fa8: Animate native collapsibles only on summary activation so initial rendering, restored open state,
  and remounts appear instantly across Astro, React, and Solid.
- da3bbd7: Expand the native registry to 48 component families, including selection, date/time
  entry, content, navigation, feedback, modal surfaces, discoverable help, attachment
  composition, and native swipe/keyboard patterns. Keep state and native accessibility
  relationships explicit and inherit theme configuration from the existing provider.

  Add isolated source-backed Expo/browser examples for every family, native platform
  availability notes, and interaction/accessibility checks across browser engines,
  themes, and viewport sizes. Keep document picking in the host app rather than adding
  an Expo dependency to installed component sources.

- da3bbd7: Expand the native registry with Field parts, a multiline Textarea, a Checkbox with
  checked/mixed and disabled states, and composable Card parts. Text entry supports
  explicit invalid styling and shares a native style recipe through installed support
  files. Native field associations and hints remain explicit consumer composition.

  Add separate browser and Expo examples for the new families, and move Expo browsing
  to a component index and focused detail screen with Android back handling.

- da3bbd7: Publish emitted source paths for relocated support files so registry consumers can install them.
  The official registry adds a React Native target with shared web/native theme generation and an
  Expo component catalog.
- da3bbd7: Align native components with their canonical web visual recipes: preserve compact painted
  surfaces, neutral and inverted selection treatments, typography, borders, radii, and elevation
  while retaining native touch regions and interaction patterns.

  Add explicit native label/content parts for state styling, shared native opacity and OKLab color
  mixing support, and rendered web/native comparison checks. Correct the catalog paragraph reset
  and extend catalog isolation checks to cover component margins.

- 05178d8: Add an ordered, non-interactive Stepper variant with a rich StepperPanel for instructions, setup
  flows, and other fixed reading sequences.
- f12cccd: Rebuild the generator around deterministic full-tree staging, atomic output replacement, AST-based
  source transforms, validated path boundaries, standalone generated framework configs, a content
  manifest, check mode, and a production CLI/package surface. The legacy cache, lifecycle shell
  hooks, and install-command configuration are removed. Registry copy entries can explicitly mark a
  global stylesheet for consumer activation, and the official beta registry advertises only its
  verified Astro, React, and Solid targets.
- 05178d8: Use 16px body text, a 28px line height, foreground contrast, and 16px gaps in StepperPanel with no extra padding below step headings so ordered instructions remain comfortable to read alongside longer documentation.
- 79de51b: Improve `TableOfContents` active-section tracking for mixed-height content by scoring vertical
  viewport intersection with a leading-edge reading bias.

## 0.0.2-beta.0

### Patch Changes

- Rebuilt generation as a deterministic, atomic, full-tree pipeline with `--check` support.
- Added first-class Astro, React, and Solid registry generation.
- Added typed manifests, framework-neutral controllers, isolated generated checks, and packed-package dogfood fixtures.
- Kept the release on the npm `beta` channel; this version does not update `latest`.

## 0.0.1

### Patch Changes

- 07f2485: v0 of @hulla/ui
- update @hulla/style syntax
- 07f2485: Alpha release (v0.0.0)
