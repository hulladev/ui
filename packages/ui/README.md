# @hulla/ui

Application developers install editable component source through the `hulla` CLI. Discover the selected registry's families, source exports, and files instead of assuming a component's install name:

```sh
bunx hulla ui --help
bunx hulla ui list --help
bunx hulla ui list --framework react-native
bunx hulla ui search text --framework react-native
bunx hulla ui add --help
```

Use `--source <URL-or-directory>` to inspect another library. Follow the install command in its listing.
See [UI commands](https://hulla.dev/docs/cli/ui), [React Native components](https://hulla.dev/docs/ui/native), or the [Markdown guides](https://github.com/hulladev/cli/blob/master/docs/ui.md).

This npm package is the registry generator for **library authors**:

```sh
uigen --help
```

See [generator authoring](https://github.com/hulladev/ui/tree/master/docs) and the optional [UI agent skill](https://github.com/hulladev/skills/tree/main/skills/ui).
