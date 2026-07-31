import { defineLanguage, type TokenRange, type TokenizerContext } from "@tanstack/highlight/core"

type Frontmatter = {
  bodyEnd: number
  bodyStart: number
  closeStart?: number
  openStart: number
  templateStart: number
}

type RawRegion = {
  end: number
  language?: "ts"
  start: number
}

const offsetRanges = (ranges: readonly TokenRange[], offset: number): TokenRange[] =>
  ranges.map((range) => ({
    ...range,
    end: range.end + offset,
    start: range.start + offset,
  }))

function findFrontmatter(code: string): Frontmatter | undefined {
  const openStart = code.charCodeAt(0) === 0xfeff ? 1 : 0
  if (!code.startsWith("---", openStart)) return

  const openingLineEnd = code.indexOf("\n", openStart + 3)
  const openingSuffix = code.slice(openStart + 3, openingLineEnd < 0 ? code.length : openingLineEnd)
  if (openingSuffix.trim()) return

  const bodyStart = openingLineEnd < 0 ? code.length : openingLineEnd + 1
  const closingFence = /^---[\t ]*\r?$/gm
  closingFence.lastIndex = bodyStart
  const match = closingFence.exec(code)

  if (!match) {
    return {
      bodyEnd: code.length,
      bodyStart,
      openStart,
      templateStart: code.length,
    }
  }

  const closeStart = match.index
  const closingLineEnd = code.indexOf("\n", closeStart + match[0].length)

  return {
    bodyEnd: closeStart,
    bodyStart,
    closeStart,
    openStart,
    templateStart: closingLineEnd < 0 ? code.length : closingLineEnd + 1,
  }
}

function findTagEnd(code: string, start: number): number {
  let index = start

  while (index < code.length) {
    const character = code[index]
    if (character === '"' || character === "'") {
      index = skipQuoted(code, index, character)
      continue
    }
    if (character === ">") return index
    index++
  }

  return -1
}

function collectRawRegions(code: string, start: number): RawRegion[] {
  const lowerCode = code.toLowerCase()
  const regions: RawRegion[] = []
  let index = start

  while (index < code.length) {
    const open = lowerCode.indexOf("<", index)
    if (open < 0) break

    const match = /^<(script|style)(?=[\s>])/i.exec(code.slice(open))
    if (!match) {
      index = open + 1
      continue
    }

    const name = match[1]?.toLowerCase()
    if (!name) {
      index = open + 1
      continue
    }

    const tagEnd = findTagEnd(code, open + match[0].length)
    if (tagEnd < 0) break

    const bodyStart = tagEnd + 1
    const closeStart = lowerCode.indexOf(`</${name}`, bodyStart)
    const bodyEnd = closeStart < 0 ? code.length : closeStart
    regions.push({
      start: bodyStart,
      end: bodyEnd,
      language: name === "script" ? "ts" : undefined,
    })

    if (closeStart < 0) break
    const closeEnd = findTagEnd(code, closeStart + name.length + 2)
    index = closeEnd < 0 ? code.length : closeEnd + 1
  }

  return regions
}

function skipQuoted(code: string, start: number, quote: string): number {
  let index = start + 1

  while (index < code.length) {
    if (code[index] === "\\") index += 2
    else if (code[index] === quote) return index + 1
    else index++
  }

  return code.length
}

function skipLineComment(code: string, start: number): number {
  const end = code.indexOf("\n", start + 2)
  return end < 0 ? code.length : end
}

function skipBlockComment(code: string, start: number): number {
  const end = code.indexOf("*/", start + 2)
  return end < 0 ? code.length : end + 2
}

function isRegexStart(code: string, index: number, expressionStart: number): boolean {
  const before = code.slice(expressionStart, index).trimEnd()
  if (!before) return true
  if (/\b(?:case|delete|in|instanceof|of|return|throw|typeof|void|yield)$/.test(before)) {
    return true
  }
  return /[=([{,:;!&|?~+*%^<>-]$/.test(before)
}

function skipRegex(code: string, start: number): number {
  let inClass = false
  let index = start + 1

  while (index < code.length && code[index] !== "\n") {
    if (code[index] === "\\") index += 2
    else if (code[index] === "[") {
      inClass = true
      index++
    } else if (code[index] === "]") {
      inClass = false
      index++
    } else if (code[index] === "/" && !inClass) {
      index++
      while (/[a-z]/i.test(code[index] ?? "")) index++
      return index
    } else index++
  }

  return start + 1
}

function skipTemplate(code: string, start: number): number {
  let index = start + 1

  while (index < code.length) {
    if (code[index] === "\\") {
      index += 2
      continue
    }
    if (code[index] === "`") return index + 1
    if (code[index] === "$" && code[index + 1] === "{") {
      const end = findExpressionEnd(code, index + 1)
      index = end < 0 ? code.length : end + 1
      continue
    }
    index++
  }

  return code.length
}

function findExpressionEnd(code: string, openingBrace: number): number {
  let depth = 1
  let index = openingBrace + 1

  while (index < code.length) {
    const character = code[index]
    const next = code[index + 1]

    if (character === '"' || character === "'") {
      index = skipQuoted(code, index, character)
      continue
    }
    if (character === "`") {
      index = skipTemplate(code, index)
      continue
    }
    if (character === "/" && next === "/") {
      index = skipLineComment(code, index)
      continue
    }
    if (character === "/" && next === "*") {
      index = skipBlockComment(code, index)
      continue
    }
    if (character === "/" && isRegexStart(code, index, openingBrace + 1)) {
      index = skipRegex(code, index)
      continue
    }
    if (character === "{") depth++
    if (character === "}" && --depth === 0) return index
    index++
  }

  return -1
}

function collectAstroExpressionRanges(
  code: string,
  start: number,
  rawRegions: readonly RawRegion[],
  context: TokenizerContext
): TokenRange[] {
  const ranges: TokenRange[] = []
  let rawIndex = 0
  let index = start

  while (index < code.length) {
    const raw = rawRegions[rawIndex]
    if (raw && index >= raw.end) {
      rawIndex++
      continue
    }
    if (raw && index >= raw.start) {
      index = raw.end
      rawIndex++
      continue
    }
    if (code.startsWith("<!--", index)) {
      const close = code.indexOf("-->", index + 4)
      index = close < 0 ? code.length : close + 3
      continue
    }
    if (code[index] !== "{") {
      index++
      continue
    }

    const end = findExpressionEnd(code, index)
    const bodyEnd = end < 0 ? code.length : end
    ranges.push({ start: index, end: index + 1, className: "operator" })
    if (bodyEnd > index + 1 && context.hasLanguage("tsx")) {
      ranges.push(
        ...offsetRanges(context.tokenize(code.slice(index + 1, bodyEnd), "tsx"), index + 1)
      )
    }
    if (end >= 0) ranges.push({ start: end, end: end + 1, className: "operator" })
    index = end < 0 ? code.length : end + 1
  }

  return ranges
}

function collectAstroDirectiveRanges(code: string, start: number): TokenRange[] {
  const ranges: TokenRange[] = []
  const directives = /\s([A-Za-z_][\w.-]*:[\w:.-]+)(?=\s*(?:=|\s|\/?>))/g
  directives.lastIndex = start
  let match: RegExpExecArray | null

  while ((match = directives.exec(code))) {
    const directive = match[1]
    if (!directive) continue
    const directiveStart = match.index + match[0].indexOf(directive)
    ranges.push({
      start: directiveStart,
      end: directiveStart + directive.length,
      className: "attr",
    })
  }

  return ranges
}

export const astro = defineLanguage({
  name: "astro",
  tokenize(code, context) {
    const ranges: TokenRange[] = []
    const frontmatter = findFrontmatter(code)
    const templateStart = frontmatter?.templateStart ?? 0

    if (frontmatter) {
      ranges.push({
        start: frontmatter.openStart,
        end: frontmatter.openStart + 3,
        className: "meta",
      })
      if (frontmatter.bodyStart < frontmatter.bodyEnd && context.hasLanguage("ts")) {
        ranges.push(
          ...offsetRanges(
            context.tokenize(code.slice(frontmatter.bodyStart, frontmatter.bodyEnd), "ts"),
            frontmatter.bodyStart
          )
        )
      }
      if (frontmatter.closeStart !== undefined) {
        ranges.push({
          start: frontmatter.closeStart,
          end: frontmatter.closeStart + 3,
          className: "meta",
        })
      }
    }

    if (templateStart < code.length && context.hasLanguage("html")) {
      ranges.push(
        ...offsetRanges(context.tokenize(code.slice(templateStart), "html"), templateStart)
      )
    }

    const rawRegions = collectRawRegions(code, templateStart)
    for (const region of rawRegions) {
      if (!region.language || region.start >= region.end) continue
      if (!context.hasLanguage(region.language)) continue
      ranges.push(
        ...offsetRanges(
          context.tokenize(code.slice(region.start, region.end), region.language),
          region.start
        )
      )
    }

    ranges.push(...collectAstroExpressionRanges(code, templateStart, rawRegions, context))
    ranges.push(...collectAstroDirectiveRanges(code, templateStart))
    return ranges
  },
})
