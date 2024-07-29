import { readFile } from 'node:fs/promises'
import pc from 'picocolors'
import type { ArgConfig, Config, ParsedArgs } from '../lib/types'

const ARGS = {
  config: {
    values: ['--config=', '-c='],
    access: '=',
    variant: 'arg',
  },
  output: {
    values: ['--output=', '-o='],
    access: '=',
    variant: 'config',
  },
  packageManager: {
    values: ['--packageManager=', '-p='],
    access: '=',
    variant: 'config',
  },
  frameworks: {
    values: ['--framework=', '-f='],
    access: '=',
    variant: 'config',
  },
  style: {
    values: ['--style=', '-s='],
    access: '=',
    variant: 'config',
  },
  rsc: {
    values: ['--rsc=', '-r='],
    access: 'flag',
    variant: 'config',
  },
  init: {
    values: ['--init', '-i', 'init'],
    access: 'flag',
    variant: 'arg',
  },
  add: {
    values: ['add'],
    access: 'cumulative',
    variant: 'arg',
  },
  githubProtocol: {
    values: ['--githubProtocol=', '-g='],
    access: '=',
    variant: 'config',
  },
} satisfies ArgConfig

export type ResConfig = Partial<{
  [K in keyof typeof ARGS]: (typeof ARGS)[K]['access'] extends 'cumulative' ? string[] : string
}>

export const parseArgs = async (args: string[]): Promise<ParsedArgs> => {
  let isInit: boolean = false
  let config: Partial<Config> = {}
  const configArgs: Partial<Record<keyof ArgConfig, string | string[]>> = {}
  const errors: Record<string, string> = {}
  let cumulative: keyof ResConfig | '' = ''
  // we skip first two args since they just contain paths
  for (const arg of args.slice(2)) {
    // If a config matches one of the values definitions, add it to config
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const argMatch = Object.entries(ARGS).find(([_key, def]) =>
      arg.includes('=') ? def.values.includes(`${arg.split('=')[0]}=`) : def.values.includes(arg)
    )
    const [argKey, argType] = argMatch ?? []

    if (!argType && !cumulative) {
      errors[arg] =
        `[🤖 ${pc.cyan('@hulla/ui')}]: ${pc.red(`Received unrecognized argument ${arg}. Aborting operation.`)}`
    } else {
      if ((argType as ArgConfig[keyof ArgConfig])?.access === 'cumulative') {
        cumulative = argKey as keyof ResConfig
      }
      if (cumulative) {
        const value = argType?.access === 'cumulative' ? [] : [...(configArgs[cumulative] as string[]), arg]
        if (ARGS[cumulative]?.variant === 'config') {
          // @ts-expect-error ts cannot gurantee string & string[] depending on arg (we could narrow types but cba)
          config[cumulative] = value
        }
        configArgs[cumulative] = value
      } else {
        const value = argType?.access === 'flag' ? 'true' : arg.split('=')[1]
        if (argType?.variant === 'config') {
          // @ts-expect-error ts cannot gurantee string & string[] depending on arg (we could narrow types but cba)
          config[argKey as keyof typeof ARGS] = value
        }
        configArgs[argKey as keyof ArgConfig] = value
      }
    }
  }
  // If the init flag was passed, we return early to prevent unnecessary fetch
  if (configArgs.init === 'true') {
    isInit = true
    // we dont care about config not loading (even if the config arg was passed) in init, since it will be overwritten
    return { errors, config, isInit, args: configArgs }
  }
  if (configArgs.config) {
    try {
      const passedConfig = await readFile(`${process.cwd()}/${configArgs.config}`, {
        encoding: 'utf-8',
      })
      config = {
        ...JSON.parse(passedConfig),
        ...config,
      }
    } catch {
      errors['Configuration argument'] =
        `[🤖 ${pc.cyan('@hulla/ui')}]: ${pc.red(`Could not load configuration file in ${process.cwd()}/${configArgs.config ?? '.hulla/ui.json'}. Did you provide the correct path?`)}`
    }
  }
  return { errors, config, args: configArgs, isInit }
}
