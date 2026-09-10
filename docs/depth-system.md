# Depth system

Depth communicates a component's relationship to its surroundings. Use spacing,
typography, and surface contrast for ordinary hierarchy; reserve elevation for
surfaces that are raised or overlap other content.

The default theme defines four shadow roles in `packages/components/src/styles.css`.
Use Tailwind’s CSS-variable shadow utilities directly in canonical component sources. Light and dark
modes share geometry, with theme-specific opacity and subtle dark-mode edge light.
The variable syntax is intentional: named Tailwind shadow utilities can inline the
light-theme value instead of resolving the token at the component.

| Utility                      | Role                                                         | Current consumers                                                                  |
| ---------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `shadow-(--shadow-control)`  | Tactile solid action; small contact shadow and top highlight | Primary, inverted, and light-mode danger buttons                                   |
| `shadow-(--shadow-raised)`   | Content lifted slightly from its surroundings                | Elevated cards, command surface                                                    |
| `shadow-(--shadow-floating)` | A temporary surface overlapping nearby content               | Popovers, select/combobox menus, dropdowns, hover cards, navigation panels, toasts |
| `shadow-(--shadow-overlay)`  | A large layer above the page                                 | Compact/workspace dialogs, drawers                                                 |

Solid buttons flatten on press and lose depth when disabled, including
`aria-disabled`. Secondary, outline, and ghost buttons remain flat. Dark-mode
danger buttons remain flat because their existing treatment is a translucent tint.
Fullscreen dialogs have no shadow because they have no exposed surrounding surface.
A command surface uses raised depth because it can be embedded; its dialog owns
modal elevation when composed inside one.

## Deliberate exceptions

- Input inset shadows communicate a recessed editable surface, not elevation.
- Keyboard keys, switch/slider thumbs, and similar small physical details may use
  local shadows appropriate to their shape.
- Outline cards and other minimally separated surfaces may retain Tailwind's
  smallest shadows. Compact inverse tooltips retain their existing small treatment.
- Focus rings are accessibility indicators, not depth, and must remain independent.

Choose a role before choosing a value. A new arbitrary surface shadow requires a
specific semantic or geometric reason; cosmetic variation alone is insufficient.
Theme overrides belong in these shared roles rather than per-component dark-mode
shadow copies. Consumer classes still merge last. No elevation prop is required.

Gradients and filters are not part of the base depth vocabulary. Existing glass is
reserved for overlapping layers; do not add it to ordinary content surfaces.
