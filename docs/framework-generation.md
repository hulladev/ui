# Framework generation

The official Hulla UI registry currently generates Astro, React, and Solid source trees. Svelte and
Vue are planned, but are not advertised in `ui.config.ts` until real component adapters and consumer
fixtures pass. A framework is a configured target, not a runtime dependency of the generator;
consumers copy only the target they install.

## Target conventions

| Target | Source suffix | Output   | Interaction model                                      |
| ------ | ------------- | -------- | ------------------------------------------------------ |
| Astro  | `.astro`      | `.astro` | Static markup plus framework-neutral DOM controllers   |
| React  | `.react.tsx`  | `.tsx`   | React props, refs, and effects                         |
| Solid  | `.solid.tsx`  | `.tsx`   | Reactive prop proxies, `splitProps`, and mount cleanup |

Framework segments are stripped from filenames and local imports. A component can exist in only a
subset of targets; the generated `ui.config.ts` and `ui.manifest.json` record actual availability.

## Astro controllers

Astro components render useful HTML without hydration. Behavior such as dialogs, tabs, menus,
selection, and focus management lives in framework-neutral controllers copied from `src/lib`.
Astro connects those controllers with small custom elements or scripts. React and Solid components
reuse the same controller where the DOM contract is shared so accessibility and keyboard behavior
do not fork by framework. Future adapters must follow the same rule.

## Adding a target

Declare the framework in `createLibrary`, add its input/output and standalone TypeScript settings,
then author native templates. Generation must pass discovery, formatting, isolated type checking,
manifest parity, and deterministic `--check` before the target is considered supported.
