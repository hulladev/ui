import {
  createHighlighter,
  type HighlightTokenClass,
  type LanguageDefinition,
} from "@tanstack/highlight/core"
import { tokensToHighlightedCode, type HighlightedCode } from "../code/code-highlight"

export type TanStackCodeHighlighterOptions = {
  fallbackLanguage?: string
  languages: readonly LanguageDefinition[]
}

function tokenClassName(className: HighlightTokenClass | undefined): string | undefined {
  return className ? `th-token th-${className}` : undefined
}

export function createTanStackCodeHighlighter(options: TanStackCodeHighlighterOptions) {
  const highlighter = createHighlighter({
    fallbackLanguage: options.fallbackLanguage,
    languages: options.languages,
  })

  return {
    highlight(code: string, { language }: { language?: string } = {}): HighlightedCode {
      const result = highlighter.tokenize(code, { lang: language })

      return tokensToHighlightedCode(
        code,
        result.lang,
        result.tokens.map((token) => ({
          className: tokenClassName(token.className),
          content: token.value,
        }))
      )
    },
    listLanguages: () => highlighter.listLanguages(),
  }
}

export type { LanguageDefinition } from "@tanstack/highlight/core"
