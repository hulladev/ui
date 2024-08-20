import { cancel, confirm, isCancel } from '@clack/prompts'
import isUnicodeSupported from 'is-unicode-supported'
import pc from 'picocolors'
import type { Codemod, Line } from '../../../codemods/src/types'

export function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function onCancel<T>(val: T) {
  if (isCancel(val)) {
    cancel(
      'Closing the CLI. If you ran into any issues, either \n\n\t‣ check out the docs at https://hulla.dev/docs/ui \n\t‣ report an issue on github https://github.com/hulladev/ui'
    )
    console.log(`[${pc.cyan('🤖 @hulla/ui')}]: Thank you for using @hulla/ui. Hope you're having a good time! ❤️`)
    process.exit()
  }
}

export function announce(msg: string) {
  return `[${pc.cyan('🤖 @hulla/ui')}]: ${msg}`
}

const unicode = isUnicodeSupported()
const symbol = (c: string, fallback: string) => (unicode ? c : fallback)

export const SYMBOL = {
  start: pc.gray(symbol('┌', 'T')),
  bar: pc.gray(symbol('│', '|')),
  end: pc.gray(symbol('└', '-')),
  topLeft: symbol('┌', '+'),
  topRight: symbol('┐', '+'),
  bottomLeft: symbol('└', '+'),
  bottomRight: symbol('┘', '+'),
  horizontal: symbol('─', '-'),
  vertical: symbol('│', '|'),
}

export function box(msg: string): string {
  const lines = msg.split('\n')
  const maxLength = Math.max(...lines.map((line) => line.length))
  const boxWidth = maxLength + 2 // Adding padding for the box

  const top = `${SYMBOL.topLeft}${SYMBOL.horizontal.repeat(boxWidth - 1)}${SYMBOL.topRight}`
  const bottom = `${SYMBOL.bottomLeft}${SYMBOL.horizontal.repeat(boxWidth - 1)}${SYMBOL.bottomRight}`

  const middle = lines.map((line) => `${SYMBOL.vertical} ${line.padEnd(maxLength, ' ')}`).join('\n')

  return `${top}\n${middle}\n${bottom}`
}

export function renderLineStatus(line: Line) {
  switch (line.status) {
    case 'added':
      return pc.green(`+ ${line.content}`)
    case 'removed':
      return pc.red(`- ${line.content}`)
    case 'unchanged':
      return pc.gray(`  ${line.content}`)
    default:
      return line.content
  }
}

export async function propose(
  codemod: Codemod,
  title = `Would you like to make following changes to ${pc.underline(codemod.path)} ?`
) {
  if (!codemod.hasChanges) {
    return
  }
  console.log(box(codemod.lines.map(renderLineStatus).join('\n')))
  const write = await confirm({ message: title })
  onCancel(write)
  if (write) {
    await codemod.run()
    announce(`Changes made to ${pc.underline(codemod.path)} ✅`)
  } else {
    announce(
      `If for whatever reason you did not like the proposed changes, please do them manually for the package to work properly. See the manual installation docs at: ${pc.cyan('https://hulla.dev/docs/ui/installation#manual-installation')}`
    )
  }
}
