# Catalog fidelity

- Default previews and prop playgrounds must expose the shared component's default appearance and real public variants. Keep surrounding markup limited to labels, layout, and necessary interaction context.
- Do not present custom color classes as component variants. Native states (for example progress value and meter thresholds) should be labelled as native states.
- Do not add preview-only backgrounds, borders, shadows, radii, typography, or sizing overrides to shared components just to dress up the catalog. Use the public API first; fix shared styling in canonical component sources when appropriate.
- Component examples and prop playgrounds must not override shared component appearance, including through utility classes, descendant selectors, inherited helper styles, or catalog scripts. Fix intended component styling in canonical sources and regenerate all frameworks. There is no customized-preview exception.
- Keep catalog CSS inside the `catalog` layer. It may style tooling chrome and illustration/layout wrappers, but must not affect component paint, typography, padding, borders, or interaction states inside a canvas.
- Run the catalog fidelity tests after changing previews or catalog CSS; the browser gate compares every rendered shared part with and without the catalog layer.
- Layout constraints and alignment are fine. Skeleton geometry is intentional usage. Native catalog controls remain tooling chrome, separate from the component being demonstrated.
