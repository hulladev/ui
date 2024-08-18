export function uniqBy<T>(arr: T[], key: keyof T) {
  return arr.filter((item, index, self) => self.findIndex((t) => t[key] === item[key]) === index)
}

/**
 * Extracts the imports for any import statements
 * @param importStatement String of the import statement
 * @returns Array of imports
 * @example extractImports("import { vn, cn } from '@/lib/style'") => ['vn', 'cn']
 */
export function extractImports(importStatement: string): string[] {
  const importRegex = /import\s*{([^}]+)}\s*from\s*['"][^'"]+['"]/
  const match = importStatement.match(importRegex)
  if (match && match[1]) {
    return match[1].split(',').map((item) => item.trim())
  }
  return []
}

/**
 * Finds the closure of a given code block.
 * @param lines array of lines
 * @param start start index
 * @returns closure end index
 */
export function findClosure(lines: string[], start: number) {
  const bracketStack = {
    '{': 0,
    '(': 0,
  }
  for (let i = start; i < lines.length; i++) {
    const line = lines[i]
    for (const char of line) {
      if (char === '{') {
        bracketStack['{'] += 1
      }
      if (char === '}') {
        bracketStack['{'] -= 1
      }
      if (char === '(') {
        bracketStack['('] += 1
      }
      if (char === ')') {
        bracketStack['('] -= 1
      }
    }
    if (bracketStack['{'] === 0 && bracketStack['('] === 0) {
      return i
    }
  }
  throw new Error('No closure found')
}

/**
 * Extracts the content between the outermost parentheses of a given string.
 * @param str - The input string containing content within parentheses.
 * @returns The extracted content between the outermost parentheses.
 * @throws {Error} If the input string is missing opening or closing parentheses.
 */
export function extractContentFromClosure(str: string): string {
  // Find the index of the first opening parenthesis
  const openParenIndex: number = str.indexOf('(')

  // Find the index of the last closing parenthesis
  const closeParenIndex: number = str.lastIndexOf(')')

  // Check if both parentheses are found
  if (openParenIndex === -1 || closeParenIndex === -1) {
    throw new Error('Invalid input: missing parentheses')
  }

  // Extract the content between the parentheses
  const content: string = str.substring(openParenIndex + 1, closeParenIndex)

  // Remove any leading or trailing whitespace
  return content.trim()
}
