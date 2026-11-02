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

## Test quality and footprint

- Retain a test only when it protects intended package behavior, a meaningful public contract, or a plausible bug with an observable consequence. Identify that risk before adding coverage; a file changing is not sufficient reason to add a test.
- Prefer the cheapest effective test through the real API. Exact return values are useful when they express a contract, such as parsing, serialization, or error handling; merely recording current output, constants, trivial getters, or fixture values is not.
- Give each failure mode one primary test. Extend an existing scenario instead of repeating setup, generation, builds, or process startup. Keep coverage at additional layers only for distinct integration or runtime risks.
- Assert behavior with independent expectations. Avoid implementation-mirroring tests, source-text or class-name checks standing in for behavior, self-generated expected fixtures, and assertions that only prove a mock does what it was configured to do. Compile-time tests must actually check types.
- Temporary tests and scratch checks are welcome during investigation. Remove them, their fixtures, and any supporting setup before handoff unless they meet the same criteria as permanent regression coverage.
- For bug fixes, prefer a focused regression that fails with the bug and passes with the fix. Name the behavior and failure condition clearly; explain the risk in the change summary when it is not obvious.
- When cleaning tests, identify the redundant coverage or missing behavioral intent. Preserve distinct failure paths and public type contracts; test count and runtime alone do not justify deletion.
- Run checks appropriate to the changed behavior and report their results. Do not add permanent tests, dependencies, or CI work merely to validate a reversible edit or increase coverage numbers.

## Validation scope and CI cost

- Keep automatic CI focused on the shipped generator and component registry. Do not repeat lint, unit tests, generation, or type checks inside a browser matrix.
- `bun run test` runs unit and package tests. `bun run verify` adds formatting, lint, generator types, generated drift detection, and isolated generated-framework types; neither command starts browsers or builds the catalogs.
- Automatic browser checks reuse a small set of existing behavior tests tagged `@smoke` in Chromium. Add a case only for a distinct, important interaction failure; do not grow this into a catalog-wide visual sweep.
- Tag browser-engine risks `@compat` only with a concrete reason, such as native form/reset semantics, focus restoration, reduced-motion handling, or engine-specific CSS. Run these when relevant with `bun run test:browser:compat`; the Browser checks workflow also supports manual compatibility and full runs.
- Catalog appearance, exhaustive viewport/theme combinations, full browser matrices, Expo exports, and consumer sandboxes are targeted or release-candidate checks. Use `bun run verify:full` or narrower commands when the actual change warrants them, rather than requiring every layer for every edit.
- Keep formatting or prose-only changes browser-free. Document the behavior exercised and any relevant checks not run; do not automatically invoke the full suite at handoff.
