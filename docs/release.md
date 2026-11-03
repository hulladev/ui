# Compatibility and release process

The current stable generator and registry line is `0.1.x`. Pin the generator and
the registry revision together for reproducible source installation.

## Release gate

1. Run `bun run verify` and the packed ESM/CommonJS, `uigen`, framework, and
   deterministic fixtures.
2. Run the packed `hulla` CLI against a real application and prove a self-contained
   production build.
3. Keep documentation, changelog entries, and generated registry output current.
4. Version with Changesets. To leave prerelease mode, run `changeset pre exit`
   followed by `changeset version`.
5. Obtain explicit authorization before GitHub pushes, tags, or npm publication.
6. Publish with `bun run release`. The guard requires a non-prerelease version and
   no remaining `.changeset/pre.json`, then publishes to npm's `latest` tag.

## Upgrade and rollback

Commit consumer-installed source before updating. Install an exact version,
regenerate, inspect the diff, and run the relevant type, interaction, and build
checks. Roll back by installing the prior exact version and regenerating from its
matching immutable registry revision. Keep generated source and support files from
the same revision.

Frameworks share design intent and supported behavior; their public parts and
native interactions can differ. Generated directories are generator-owned. Local
registries are a development workflow and must not become published dependencies.
