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
- Keep example code and rendered demos aligned: the visible example must use the same shared
  component APIs and composition demonstrated by its source view.
- Native elements remain appropriate when they are the component's intentional semantic primitive
  or when no shared component exists. Do not fake a missing shared component for presentation; call
  out the gap and add or explicitly scope the missing component first.
