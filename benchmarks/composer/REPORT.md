# `cn` 0.3.0 vs `tailwind-merge` 3.6.0

Run on 2026-09-15 on a 24 GB Apple M4 Pro MacBook Pro (macOS/Darwin 25.6), with Node 22.18.0 and Bun 1.4.0. The benchmark imports each composer through `style({ composer })` from `@hulla/style` 0.4.0. `cn-twMerge` means the `twMerge` export from `cn`; `cn-cn` means its optimized `cn` export.

The npm registry resolved `cn@0.3.0`, whose package metadata identifies `git+https://github.com/shadcn-ui/cn.git`. The comparison uses the workspace-installed `tailwind-merge@3.6.0`, not the registry's newer 3.7.0.

## Runtime results

Median nanoseconds per operation after two warmup blocks; five measured blocks; every implementation/scenario pair ran in its own process. Lower is better.

### Node 22.18.0

| Workload                    | tailwind-merge | cn `twMerge` |  cn `cn` | cn `cn` speedup |
| --------------------------- | -------------: | -----------: | -------: | --------------: |
| Final stable component call |       1,668 ns |     1,655 ns |    25 ns |           66.6× |
| Full stable Button path     |       1,773 ns |     1,696 ns |    37 ns |           48.3× |
| Full rotating Button path   |       1,433 ns |     1,367 ns |    47 ns |           30.2× |
| Real-source working set     |       5,147 ns |       495 ns |    82 ns |           62.4× |
| Mixed optional inputs       |         991 ns |     1,024 ns |   150 ns |            6.6× |
| First-pass diverse strings  |      18,896 ns |     8,347 ns | 9,041 ns |            2.1× |

### Bun 1.4.0

| Workload                    | tailwind-merge | cn `twMerge` |  cn `cn` | cn `cn` speedup |
| --------------------------- | -------------: | -----------: | -------: | --------------: |
| Final stable component call |         127 ns |       195 ns |    13 ns |            9.6× |
| Full stable Button path     |         318 ns |       212 ns |    27 ns |           11.6× |
| Full rotating Button path   |         304 ns |       199 ns |    33 ns |            9.2× |
| Real-source working set     |       4,720 ns |       141 ns |    52 ns |           90.8× |
| Mixed optional inputs       |         238 ns |       291 ns |   148 ns |            1.6× |
| First-pass diverse strings  |      14,238 ns |     2,738 ns | 3,963 ns |            3.6× |

The full Button workload calls both variant resolvers (`$variant` and `$size`) and then the final composer, matching the generated React component's shipping call path. The stable and rotating results show that `cn`'s optimized export, including its argument cache, is the meaningful integration candidate. Merely swapping `tailwind-merge`'s `twMerge` for `cn`'s `twMerge` leaves much of the repeated-call gain unused.

The real-source workload cycles over 310 unique quoted literals heuristically harvested from React, Solid, and Astro sources and pairs them with six consumer overrides. It is representative input rather than an AST-exact inventory of `cn()` calls. The first-pass workload uses a new arbitrary-property string in every block; it measures unseen whole strings after module initialization, not startup or first import.

## Output compatibility

The comparison ran 951 exact-output cases: each harvested string alone, with a consumer override, paired with its neighbor, three mixed-input calls through `@hulla/style`, and explicit semantic-token, arbitrary-value, modifier, and font cases.

There was one unique output difference, observed with both `cn` exports. It is not by itself evidence of a visual regression:

```text
input fragment: shadow-inner ... shadow-none
tailwind-merge 3.6.0: preserves shadow-inner ... shadow-none
cn 0.3.0:                 drops shadow-inner ... shadow-none
```

The minimal reproducer is `shadow-inner shadow-none`. The full input comes from the real [Switch style source](../../packages/components/src/+css/switch.css.ts) plus a `shadow-none` consumer override. This is a behavior change from the installed baseline, but it may reflect different utility/version semantics. It should become an explicit compatibility decision or regression test before switching.

The six arbitrary-font cases from shadcn-ui/cn issue #23, originally reported against `cn` 0.2.4, all produced identical output in `cn` 0.3.0 and `tailwind-merge` 3.6.0. This includes bare arbitrary families, arbitrary family plus weight, and labelled CSS-variable family forms.

## Browser bundle size

Measured locally with esbuild 0.27.3, ESM browser target, minification and tree shaking. Each entry imports `@hulla/style` and exports the real `{ cn, vn }` wrapper.

| Composer                 | Minified |  gzip -9 | gzip delta |
| ------------------------ | -------: | -------: | ---------: |
| tailwind-merge `twMerge` | 27,804 B |  8,833 B |          — |
| cn `twMerge`             | 26,785 B | 11,060 B |   +2,227 B |
| cn `cn`                  | 26,785 B | 11,060 B |   +2,227 B |

`cn` is 1,019 bytes smaller before compression and 2,227 bytes larger after gzip in this actual wrapper bundle. These measurements do not include a project-specific `cn build` table subset.

## Recommendation

If repeated composer cost is important enough to trade about 2.2 KB gzip, evaluate the optimized `cn` export rather than its `twMerge` export. Before changing the default, add an intentional expectation for the `shadow-inner`/`shadow-none` case and run the repository's component checks against that decision. The runtime numbers are microbenchmarks of class composition, so they should not be presented as equivalent end-to-end render speedups.

The exact run is reproducible with the commands in [README.md](./README.md), and [raw-results.json](./raw-results.json) preserves every timed sample and checksum from this run. Module startup, memory use, project-specific `cn build`, and browser rendering are outside this bounded comparison.
