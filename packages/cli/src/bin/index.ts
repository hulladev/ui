import { cancel } from '@clack/prompts'
import { readFile } from 'fs/promises'
import pc from 'picocolors'
import type { Config } from '../lib/types'
import { addComponent } from '../scripts/addComponent'
import { setup } from '../scripts/setup'
import { parseArgs } from '../utils/args'
import { announce } from '../utils/cli'
import { values } from '../utils/objects'

// If it's found, we run the 'add' version of the cli
const parsedArgs = await parseArgs(process.argv)

// Special init param passed, run setup straight away
if (parsedArgs.isInit) {
  // Init arg passed, start setup
  await setup()
} else {
  // Adding components: check for errors
  const errorMessages = values(parsedArgs.errors)
  errorMessages.forEach((error) => console.error(error))
  // If there are errorMessages present, don't run the program
  if (errorMessages.length) {
    cancel(
      announce(
        `Check out ${pc.underline(pc.cyan('https://hulla.dev/docs/ui/getting-started/configuration'))} if you need help.`
      )
    )
    // No errors found, run the program
  } else {
    // No config passed, attempt to fetch default config path
    // bit confusing naming, we sacrifice DX so use can pass --config=something
    // hence the .config.config ({config object}.{config param})
    if (parsedArgs.args.config === undefined) {
      const defaultConfig = await readFile(`${process.cwd()}/.hulla/ui.json`)
        .then((res) => JSON.parse(res.toString()))
        .catch(() => {
          throw new Error(
            `No config found under "${pc.cyan('.hulla/ui.json')}" \n If it's your first time running the tool, please use the init flag like ${pc.cyan('npx @hulla/api init')} \n If your config file is located elsewhere, please use the --config=<path> argument`
          )
        })
      await addComponent({ ...parsedArgs, config: { ...(defaultConfig as Config), ...parsedArgs.config } })
      // Config was passed with config param, no need to fetch default config, just execute add component
    } else {
      // if the config arg was passed the config will always be loaded (will error otherwise)
      await addComponent(parsedArgs)
    }
  }
}
