import { build } from "./build"
import { Config, Frameworks } from "./types.public"

export function defineConfig<const F extends Frameworks>(
  config: Config<F>
): { build: () => Promise<void> } {
  return {
    build: () => build(config),
  }
}
