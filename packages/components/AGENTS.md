# Component package guidance

These instructions apply to work under `packages/components`.

## Product model

Hulla's public components are UI primitives: small, directly usable building blocks that stay close
to native platform semantics and are intended to be composed into application-specific patterns.
Their default styling is a starting point, not a behavioral abstraction or a prescribed application
architecture.

The default theme does not have a product name. Do not call it Ion or introduce another branded
theme name without an explicit product decision.

Do not automatically split a component into an unstyled `*Primitive` and a styled public wrapper.
A second behavioral layer is justified only when a concrete complex component needs independently
reusable behavior, and that architecture must be discussed explicitly before implementation.

## Architecture

- A leaf component should render its native element directly. Do not add a `*Primitive` companion,
  primitive import, forwarding wrapper, or mirrored primitive export merely to separate markup from
  styling.
- Keep one public runtime component per source module. An exported prop type for that component is
  fine; related runtime components such as `FieldLabel` and `FieldError` belong in separate files.
- When a React component accepts children, destructure and render `{children}` explicitly. Do not
  rely on `children` remaining inside a spread props object, even when React would technically
  render it.
- Prefer transparent composition and native attributes over hidden coordination. Do not walk
  children, generate relationships, inherit native state, or propagate `disabled`, `required`,
  `invalid`, IDs, or ARIA attributes through context for convenience.
- Add framework context only when state must cross a component subtree for essential interaction
  behavior and native composition cannot express it. Discuss and document that requirement before
  implementing it.
- Give components stable state and part hooks where useful. Prefer semantic `data-*` attributes and
  framework-appropriate class/style hooks over theme-specific markup.
- Complex components should reuse established primitives and internal behavior utilities. Reuse a
  public component only when its semantics match; otherwise share the lower-level behavior or style
  recipe.
- Keep accessibility and interaction behavior consistent across supported frameworks. Preserve
  framework-native ergonomics where exact API parity would be unnatural.
- Do not edit `generated` directly. Author canonical sources in `packages/components/src`, run the
  generator, and commit generated output with the source change.

The public import and directory conventions are not finalized. Do not invent a new package surface
incidentally while adding a component; follow an established convention or make the packaging
decision explicit first.

## Default-theme styling

- Treat design tokens as a shared vocabulary, not as a composition template. They should create
  consistency without forcing every component into the same visual treatment.
- Use semantic tokens from `src/styles.css`; do not couple component recipes to raw palette names
  when a semantic role exists.
- Put a component's one-off static classes directly on the rendered element through `cn(...)`, with
  the consumer's `className` or framework equivalent merged last.
- Do not extract static classes into an object with keys such as `root`, `base`, `label`, or
  `description` merely to organize them. That indirection needs to provide reuse, behavior, or type
  inference; otherwise keep the classes at their point of use.
- Use `vn(...)` for a real variant map and shared recipes only when they are consumed in more than
  one place or provide concrete type/composition value. Keep extracted styles narrowly named for
  that purpose instead of wrapping every class in a general component styles object.
- Name local style resolver functions with a singular `$` prefix matching the visual axis, such as
  `$variant` and `$size`. Keep public prop names native or consumer-facing; for example, Input's
  `controlSize` prop is resolved through the internal `$size` style function.
- Use the configured `@hulla/style` helpers in `src/lib/style.ts` when class composition is
  needed. The canonical examples use `cn`'s optimized `cn` export as the composer; the CLI also
  supports selecting `tailwind-merge` for consumer installs.
- Give each interactive state one deliberate focus treatment. Do not stack a global outline with a
  component border or ring when both communicate the same focus state. When a component owns a
  variant-specific focus treatment, explicitly suppress the global outline and verify every
  variant in keyboard focus.
- Keep visual variants intentionally small. Add a prop only when it represents a recurring semantic
  distinction that cannot be expressed cleanly through composition or `className`.
- Prefer spacing, typography, and contrast for hierarchy. Avoid making borders, nested cards,
  tinted panels, pills, gradients, or glass the default solution to every layout problem.
- Reserve glass treatment for layers that are meaningfully elevated or overlapping. Ordinary
  content surfaces should generally remain solid.
- Design dark mode as its own contrast hierarchy. Do not produce it by tinting every surface toward
  the accent color.
- The default theme may evolve substantially. Do not encode its current appearance into behavioral
  component contracts.

### Token promotion rule

Keep the public token surface deliberately small. Add a token to `src/styles.css` only when at least
one of these is true:

- The value represents the same semantic role across multiple components, such as foreground,
  border, primary action, or focus indication.
- The value must change with a theme, contrast mode, or accessibility preference.
- Consumers are expected to override the value as part of theming the library.

Repetition alone is not enough: two components using the same measurement can be coincidental.
Promote a repeated value only when the recurrence expresses the same design decision.

- Prefer the existing semantic tokens and Tailwind scales before introducing another abstraction.
- Keep component-specific measurements, shadows, transforms, timings, and visual details directly
  at the component's point of use or in a justified variant/shared recipe. A deliberate arbitrary
  value is preferable to a misleading token.
- Promote a reusable value to a token and a reusable composition or state treatment to a shared
  recipe. Do not use tokens as a substitute for recipes.
- Do not create component-named tokens or speculative tokens for components and states that do not
  exist yet.
- Catalogue and showcase styling is evidence only when a library component shares the same
  semantic requirement. Page-specific art direction should remain locally scoped.
- Remove tokens that no longer have a real consumer or semantic contract.

## TypeScript

- Use `type`, not `interface`, in authored TypeScript, TSX, and framework script blocks.
- Start prop types from the native element's props and add only component-specific capabilities.
- Export a component's prop type when it provides real consumer or tooling value. Do not introduce
  extra public types speculatively.
- Prefer inferred types when they stay readable. Add annotations when they improve editor feedback,
  constrain a public contract, or prevent an unsafe inference.

## Public APIs

- Start from native platform props and behavior.
- Prefer composition over convenience props and compound abstractions over monolithic components.
- Keep required props to the true behavioral minimum. Default safe native behavior where
  appropriate, such as `type="button"` for buttons.
- Do not add polymorphism, `asChild`, slotting, loading state, icon placement, size matrices, or
  broad variant sets until a concrete use case demonstrates the need.
- Keep `className` or the framework-equivalent escape hatch available on themed components.
- Do not hide meaningful native events or attributes behind custom equivalents.

## Design intent

The default theme should feel precise, calm, modern, and confident. It may use expressive
typography or selective luminous detail, but should not resemble a generic SaaS dashboard,
Material-style component set, or a copy of another design system.

Raycast and other contemporary products may inform qualities such as restraint, depth, density, and
layering. They are references, not templates to reproduce.

## Workflow

Adding or updating a component must include the corresponding catalog entry in `apps/catalog`.
Keep its preview, usage examples, generated source views, navigation, and component-specific catalog
styling current in the same change.

The catalog's rendered source view must be the raw source that actually produces the canvas. Do not
add a hand-authored React/Astro equivalent to the rendered view; put small copy-ready translations
under the explicitly minimal view instead. When a new component replaces markup already present in
another preview or showcase, migrate that composition to the shared component as part of the same
change.

Before implementing a component:

1. Inspect related components, shared behavior, recipes, tokens, and generated output.
2. State the native element and semantic/accessibility contract.
3. List every proposed custom prop, context, hook, extra runtime export, and extracted style recipe
   with the concrete need it serves. If a need is only convenience or organization, leave it out.
4. Identify which existing components or internal utilities it should compose.
5. Choose a clear visual idea and implement only the API required by the current contract.

Before handing off a component:

1. Exercise pointer and keyboard interaction, focus visibility, disabled states, and relevant ARIA
   relationships.
2. Inspect the default theme in light and dark modes and at a narrow viewport.
3. Verify that the component remains composable through native attributes, children, and the
   framework's class/style escape hatch.
4. Add or update the component's catalog coverage and verify it in both contrast modes and at a
   narrow viewport.
5. Confirm the rendered source is derived directly from the rendering file, and keep any simplified
   copy-ready example under the minimal source view.
6. Audit existing examples and showcases for facsimiles superseded by the component.
7. Run formatting, lint, type checks, generation checks, and the repository verification suite
   appropriate to the change.
