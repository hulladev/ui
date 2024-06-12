import { cancel } from '@clack/prompts'
import { readFile } from 'fs/promises'
import pc from 'picocolors'
import { addComponent } from '../scripts/addComponent'
import { setup } from '../scripts/setup'
import { parseArgs } from '../utils/args'
import { announce } from '../utils/cli'
import { values } from '../utils/objects'

// If it's found, we run the 'add' version of the cli
const argConfig = await parseArgs(process.argv)

// Special init param passed, run setup straight away
if (argConfig.isInit) {
  await setup()
} else {
  const errorMessages = values(argConfig.errors)
  errorMessages.forEach((error) => console.error(error))
  // If there are errorMessages present, don't run the program
  if (errorMessages.length) {
    cancel(
      announce(
        `Check out ${pc.underline(pc.cyan('https://hulla.dev/docs/ui/getting-started/configuration'))} if you need help.`
      )
    )
  } else {
    // No config passed, attempt to fetch default config path
    // bit confusing naming, we sacrifice DX so use can pass --config=something
    // hence the .config.config ({config object}.{config param})
    if (argConfig.config.config === undefined) {
      try {
        const defaultConfig = await readFile(`${process.cwd()}/.hulla/ui.json`)
        await addComponent({ ...defaultConfig, ...argConfig.config })
      } catch {
        // No config found - run init (setup)
        await setup()
      }
      // Config was passed with config param, no need to fetch default config, just execute add component
    } else {
      await addComponent(argConfig.config)
    }
  }
}
