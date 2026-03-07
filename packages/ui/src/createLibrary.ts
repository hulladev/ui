import { build } from "./build"
import { Config, Frameworks, UILibraryAPI } from "./types.public"

export function createLibrary<const F extends Frameworks>(config: Config<F>): UILibraryAPI<F> {
  return {
    build: () => build(config),
    config,
  }
}
