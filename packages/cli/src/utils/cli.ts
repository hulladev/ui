import { cancel, isCancel } from '@clack/prompts'
import isUnicodeSupported from 'is-unicode-supported'
import pc from 'picocolors'

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
}
