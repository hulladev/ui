# Beta compatibility and release process

The current line is `0.0.x-beta.N`. Component contracts, registry metadata, generation output, and
consumer installation behavior may still change between beta builds.

## Known limitations

- Framework parity means supported component families and behavior, not byte-identical APIs.
- Generated directories are wholly owned; hand edits are replaced.
- Source transforms reject dynamic or ambiguous `resolve(...)` usage.
- Sibling local registries are a development workflow, never a published package dependency.
- Consumer aliases must resolve from the configured code root; nested `@/src/...` output is a bug.

## Release gate

1. Run `bun run verify` and packed ESM/CommonJS, `uigen`, Astro, Solid, and deterministic fixtures.
2. Run the packed `hulla` CLI against a real application and prove a self-contained build.
3. Complete repository documentation and changelog entries.
4. Keep every pending `@hulla/ui` changeset at patch level.
5. Obtain explicit authorization before any GitHub push, tag, or npm publish.
6. Publish only with `bun run release:beta`, which guards a `0.0.x-beta.N` version and uses the npm
   `beta` dist-tag. Never publish this line to `latest`.

## Upgrade and rollback

Commit consumer-installed source before updating. Install the exact new beta, regenerate, inspect
the source diff, and run browser/type/build checks. To roll back, install the prior exact beta and
regenerate; do not mix a new registry with an old generator or CLI. Immutable beta tags make that
reconstruction auditable.
