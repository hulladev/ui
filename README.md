# `@hulla/ui`

`@hulla/ui` is the source-component registry and deterministic generator used by the
[`hulla` CLI](https://github.com/hulladev/cli). This repository is for library authors and
contributors; application developers install components through `hulla` (CLI), not directly from this
workspace.

The generator turns framework-specific source templates into complete, validated registries. The
official component registry currently ships Astro, React, Solid, and React Native components; Svelte and Vue adapters
remain planned. Every build is staged, compared by content, and swapped into place atomically, so
failed generation never leaves a partially updated registry.

## AI agent guidance

Install the [@hulla/ui skill](https://github.com/hulladev/skills/tree/main/skills/ui) for package-specific guidance on installing and composing application components, shared themes, and native interactions:

```sh
npx skills add hulladev/skills --skill ui
```

Choose your coding agent in the installer. See [installation and version compatibility](https://hulla.dev/docs/cli/agent-skills) before adding or updating skills in your application.

## Start developing

Requirements: Bun 1.3.9 and Node.js 20 or newer.

```bash
bun install --frozen-lockfile
bun run dev
```

`bun run dev` starts both the component generator watcher and the Astro catalog at
`http://localhost:4321`. Edit files under `packages/components/src`; do not edit `generated`
directly.

Before opening a pull request, run the same gate used by CI:

```bash
bun run verify
```

## Common commands

| Command                       | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| `bun run dev`                 | Watch, regenerate, and hot-reload the linked catalog                    |
| `bun run dev:generator`       | Watch and regenerate without the catalog                                |
| `bun run dev:catalog`         | Run the catalog together with its generator watcher                     |
| `bun run dev:catalog-only`    | Run only Astro against the current generated output                     |
| `bun run generate`            | Rebuild the committed registry atomically                               |
| `bun run generate:check`      | Report generated drift without writing files                            |
| `bun run check-generated`     | Type-check generated output in isolated framework projects              |
| `bun run test`                | Run unit and package tests without browsers or catalog builds           |
| `bun run verify`              | Check the generator and shipping registry once, without browsers        |
| `bun run test:browser:smoke`  | Run essential interactions in Chromium                                  |
| `bun run test:browser:compat` | Run focused engine-specific behavior across all three browsers          |
| `bun run verify:full`         | Also check source types, build catalogs, and run the full browser suite |

Automatic CI runs the library checks once. Changes to components, generated output, or catalog
code also run ten existing interaction tests in Chromium. Documentation-only changes do not
install browsers. Full catalog sweeps and cross-browser compatibility checks can be requested
through the **Browser checks** workflow or the commands above; they are not repeated for every PR.

Use compatibility checks for native forms/reset, focus, reduced motion, and engine-specific CSS
changes. Use the full suite for broader theme, framework, or catalog changes and release-candidate
validation. Browser commands require the corresponding Playwright browsers to be installed.

## Repository map

- `packages/ui` — published `@hulla/ui` generator API and `uigen` CLI.
- `packages/components/src` — canonical Astro, React, and Solid component templates plus shared
  source files.
- `generated` — committed registry consumed by the `hulla` CLI.
- `apps/catalog` — real Astro compilation and visual inspection environment.
- `docs` — generator API, architecture, and component-authoring contracts.

## Generator guarantees

- Builds are deterministic and never depend on timestamps or an incremental cache.
- The complete output is staged before the current registry is replaced.
- Deleted source files and components are pruned automatically.
- `--check` detects missing, changed, and unexpected files without overwriting them.
- Paths are contained within their declared roots, output cannot overlap source inputs, and
  generated metadata cannot be overwritten by copied files.
- A content-hashed `ui.manifest.json` records component availability and every generated file.
- Generated framework trees are type-checked independently of monorepo-only configuration.

## Documentation

- [Contributing](./contributing.md)
- [Component authoring](./docs/component-authoring.md)
- [File upload, tag input, and stepper](./docs/form-and-stepper-primitives.md)
- [Iconography](./docs/iconography.md)
- [Generator API and CLI](./docs/generator-api.md)
- [Build architecture](./docs/architecture.md)
- [Framework generation](./docs/framework-generation.md)
- [Consumer installation and local dogfooding](./docs/consumer-installation.md)
- [Beta compatibility and release process](./docs/beta-release.md)

For application installation flows, see the [`hulla` CLI](https://github.com/hulladev/cli).

## React Native

The `react-native` registry target ships 48 component families, covering forms, content, navigation,
modal surfaces, feedback, date/time selection, and native swipe/keyboard compositions. Each family
renders React Native elements and preserves native props, events, refs, and `style`. All families
have independent Expo examples and browser previews. See [native architecture](./docs/native-architecture.md)
for coverage, explicit composition contracts, and desktop patterns that intentionally differ on mobile.

Select **react-native** in the framework picker (the CLI may also detect React from Expo). Then run
`hulla ui add --framework react-native button input` or choose another available family. Keep the
React and React Native versions aligned with the Expo SDK already installed in the app.

Start the component catalog with `bun run dev:native`, then open it in Expo Go on iOS or Android.
`bun run dev:native:ios` and `bun run dev:native:android` open a simulator/emulator when installed.
The browser catalog keeps shared components in their usual sections. Select **React Native** in the
component's framework picker to load its native preview and source, for example
`/layout-feedback?framework=react-native#card`. The **Native only** section at `/react-native` contains
EmptyState, KeyboardAware, List, NumberField, and SwipeActions, derived from registry availability.
Existing shared-family routes such as `/react-native/button` lead to their corresponding component
section. Native previews load on demand and follow the catalog theme control.
The Expo catalog retains its full 48-family index and mounts one detail example at a time; its back
action returns to the index. Browser previews do not substitute for device accessibility and interaction checks.
Run `bun run generate` after editing canonical sources; the Expo catalog consumes `generated`.

### Shared design foundations

See [platform design](./docs/platform-design.md) for current size differences, density policy,
touch interaction patterns, and components that may exist on only one platform.

`packages/components/src/theme.json` is the source of truth for semantic colors and radii.
`bun run generate` produces the web `theme.css` and native sRGB tokens before generating registries.
`bun run generate:check` detects drift in both theme outputs and generated component sources.
Web colors retain their OKLCH values; native values are gamut-mapped to sRGB, including alpha-aware
color mixing. Browser behavior utilities, fonts, Tailwind, and CSS files are scoped to web targets.

Configure appearance and fonts once with `NativeThemeProvider`. Components inherit the nearest
provider; ordinary usage does not pass `theme`. With no provider, built-in themes follow device
appearance. `mode` supports `system`, `light`, and `dark`; nested providers can scope a theme or
font override. An optional component `theme` prop overrides only that component.

The native registry installs its provider, context, tokens, and hook under `lib/native-theme*` and `lib/native-tokens.ts`.
For components under `src/components/ui` and support files under `src/lib`:

```tsx
import { NativeThemeProvider } from "@/lib/native-theme"
import { Button, ButtonText } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Example() {
  return (
    <NativeThemeProvider mode="system">
      <Input accessibilityLabel="Weight" inputMode="decimal" />
      <Button
        onPress={() => {
          /* save */
        }}
      >
        <ButtonText>Save</ButtonText>
      </Button>
    </NativeThemeProvider>
  )
}
```

`Button` paints a compact 32-unit surface inside a minimum 48-unit press region. Its `style` prop controls the press region and layout; `contentStyle` controls the painted surface. Both support pressed-state callbacks.

`Button` accepts native children, including Pressable's render callback. Compose its label with
`ButtonText`; pass matching `variant` and `disabled` props to both parts. This keeps icons,
text, state, and accessibility under the application's control. Raw strings must be inside a text
component, as with any React Native view. Inputs preserve `multiline`, `inputMode`, `editable`,
`onChangeText`, and native accessibility attributes. Associate labels explicitly using native props
rather than expecting a wrapper to infer relationships.

For typography matching the web theme, load Schibsted Grotesk and IBM Plex Mono with your app's
font loader and pass `fonts` (`regular`, `medium`, `semibold`, `mono`) to the root provider.
The Expo catalog demonstrates `expo-font` with `@expo-google-fonts` assets. Without font configuration,
components use platform fonts and keep system text scaling enabled. The registry itself requires
React Native and React, with no Expo dependency or CSS styling runtime.

For current coverage gaps and styling-backend tradeoffs, see [native architecture](./docs/native-architecture.md).
