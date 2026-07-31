import { describe, expect, test } from "bun:test"
import { Glob } from "bun"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

const reactRoot = resolve(import.meta.dir, "../src/react")

describe("React ref composition", () => {
  test("passes native refs through public component props", async () => {
    const files: string[] = []
    for await (const filename of new Glob("**/*.react.tsx").scan({ cwd: reactRoot })) {
      files.push(filename)
    }

    for (const filename of files) {
      const source = await readFile(resolve(reactRoot, filename), "utf8")
      expect(source).not.toContain("ComponentPropsWithoutRef")
      if (source.includes("ref={elementRef}")) {
        expect(source).toContain("useImperativeHandle(props.ref")
      }
    }
  })
})
