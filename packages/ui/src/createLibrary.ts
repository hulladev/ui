import { build } from "./build"
import type { Config, Frameworks, UILibraryAPI } from "./types.public"

export function createLibrary<const F extends Frameworks>(config: Config<F>): UILibraryAPI<F> {
  return {
    build: (options) => build(config, options),
    config,
  }
}
