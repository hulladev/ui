# Iconography

Hulla uses [Lucide](https://lucide.dev/) as its recommended interface icon family. Lucide is a
well-established SVG set with framework adapters and direct named imports, so icons remain
tree-shakeable without a font, sprite, CDN, or client-side loader.

## Framework packages

| Target  | Package         |
| ------- | --------------- |
| Vanilla | `lucide`        |
| Astro   | `@lucide/astro` |
| React   | `lucide-react`  |
| Solid   | `lucide-solid`  |

Svelte and Vue adapters will declare their matching Lucide packages when those registry targets
ship.

Only declare an adapter when a generated framework tree actually imports it. Component-level
package metadata must repeat that dependency so installing a generated component also installs its
matching icon adapter.

## Usage contract

- Import icons directly by name from the official package for the current framework. Do not create
  a string-name registry or import an entire icon map; direct imports preserve tree shaking.
- Render UI icons at `1rem` (16px) in compact controls, `1.125rem` (18px) in comfortable controls,
  and `1.25rem` (20px) for prominent standalone actions. Use larger icons only as illustrative
  content.
- Keep Lucide's default stroke unless a component recipe has a specific optical reason to change it.
  Use `currentColor` so the surrounding component owns semantic color.
- Treat icons accompanying visible text as decorative with `aria-hidden="true"` and
  `focusable="false"`. Give icon-only controls an accessible name on the control itself; do not rely
  on the SVG to name the control.
- Prefer one clear icon over stacked glyphs or badges. Never make an icon or color the only cue for
  status, errors, or destructive actions.
- Brand marks and domain-specific illustrations may use canonical assets, but must not introduce a
  second general-purpose interface icon family.
- Components must not choose a semantic glyph for the consumer. A component may expose an optional
  layout part such as `AlertIcon`, but the consumer supplies the icon child.

## Performance

Use framework components or raw SVG assets that resolve at build time. Never load icons from a
runtime API or ship an icon font. Named imports allow production bundlers to remove unused icons,
and each generated framework package remains responsible only for its own adapter.
