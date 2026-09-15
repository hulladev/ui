# Composer benchmark

This benchmark compares the installed `tailwind-merge` composer with the published `cn` package through `@hulla/style`. It covers the final component `cn(...)` call, full generated Button variant resolution, rotating props and overrides, class strings heuristically harvested from quoted literals in the real component sources, mixed optional inputs, and first-pass diverse inputs that never repeat a whole string between blocks.

Dependencies stay outside the workspace so running the comparison cannot update `package.json` or `bun.lock`:

```sh
mkdir -p /private/tmp/hulla-composer-benchmark-deps
npm install --prefix /private/tmp/hulla-composer-benchmark-deps --no-audit --no-fund \
  cn@0.3.0 tailwind-merge@3.6.0 @hulla/style@0.4.0 esbuild@0.27.3
node benchmarks/composer/benchmark.mjs > /private/tmp/hulla-composer-benchmark.json
```

The runner uses a separate process for every runtime, implementation, and scenario. Each process warms up for two blocks and reports the median of five timed blocks. Outputs feed a checksum. The generated Button fixture is checked against `generated/react/button/button.tsx` before results are emitted.

`REPORT.md` records one run on the named machine and runtimes. Microbenchmark timing varies across machines; rerun locally before using the ratios for a decision.
