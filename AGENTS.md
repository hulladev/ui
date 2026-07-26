# Workspace guidance

These instructions apply to the entire UI workspace, including component sources, generated output,
catalog previews, usage examples, and showcases.

## Shared-component fidelity

- Always compose product components and examples from the real shared components that consumers
  receive. When a shared component already exists, import and render it instead of substituting raw
  HTML, a local mock, a hand-styled facsimile, a stub, or preview-only markup.
- Catalog previews, playgrounds, usage examples, and showcases must exercise the actual generated
  components together so their real composition, styling, behavior, accessibility, and framework
  output are visible during evaluation.
- Treat rendered and minimal source views as different contracts:
  - A rendered source view must come directly from the file that renders the canvas (for example,
    through a raw source import). Never write a parallel framework "equivalent," reconstructed
    snippet, or simplified copy and label it as rendered code.
  - A minimal source view is the place to remove loops, data models, catalog controls, decorative
    layout, and other demo abstractions. It may be a deliberately smaller copy-ready composition,
    but it must use the real public component APIs and must not claim to be the exact rendered file.
  - When a rendered example changes, its source view must update by construction rather than by
    manually synchronizing a second string.
- When adding a shared component, audit existing catalog previews, playgrounds, usage examples, and
  showcases for markup that the new component now supersedes. Replace those facsimiles in the same
  change so composition examples demonstrate the actual shared component.
- Native elements remain appropriate when they are the component's intentional semantic primitive
  or when no shared component exists. Native controls are also appropriate for catalog tooling
  chrome that manipulates a preview rather than appearing inside the product example. Do not fake a
  missing shared component for presentation; call out the gap and add or explicitly scope the
  missing component first.
