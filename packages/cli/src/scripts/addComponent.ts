import { intro, multiselect, outro, spinner } from '@clack/prompts'
import { exec } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import pc from 'picocolors'
import type { PackageJSON } from '../../../generator/src/types'
import { extensions as EXT, intros } from '../lib/constants'
import { createGitAPI } from '../lib/git'
import type { FrameworksKeys, ParsedArgs } from '../lib/types'
import { SYMBOL, announce, capitalizeFirstLetter, onCancel } from '../utils/cli'
import { getInstallCommand, replaceTypescriptAlias } from '../utils/fs'

type GFile = {
  file: string
  content: string
  path: string
  dir: string
}

export const addComponent = async (parsedArgs: ParsedArgs) => {
  const randomIntro = intros[Math.floor(Math.random() * intros.length)]
  intro(announce(`${randomIntro}`))
  /* ------------ Fetch available components from the cache or repo ----------- */
  const s = spinner()
  s.start('Checking available components...')

  if (parsedArgs.config.githubProtocol === undefined) {
    s.stop('No github protocol found in config. Please check https://hulla.dev/docs/ui/config/#protocol ❌')
    process.exit(1)
  }

  if (
    parsedArgs.config.style?.util === undefined ||
    parsedArgs.config.output === undefined ||
    parsedArgs.config.typescript?.src === undefined ||
    parsedArgs.config.typescript?.alias === undefined ||
    parsedArgs.config.frameworks === undefined ||
    parsedArgs.config.packageManager === undefined
  ) {
    const missingValues = [
      parsedArgs.config.style?.util === undefined ? 'util' : '',
      parsedArgs.config.output === undefined ? 'output' : '',
      parsedArgs.config.typescript?.src === undefined ? 'typescript.src' : '',
      parsedArgs.config.typescript?.alias === undefined ? 'typescript.alias' : '',
      parsedArgs.config.frameworks === undefined ? 'frameworks' : '',
      parsedArgs.config.packageManager === undefined ? 'packageManager' : '',
    ].filter(Boolean)
    console.error(
      `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Missing required config values ${pc.underline(missingValues.join(' '))}. PLease run the initialzing command ${pc.cyan('@hulla/ui init')} again.`
    )
    process.exit(1)
  }

  const git = createGitAPI(parsedArgs.config.githubProtocol)
  const gitContents = await git.listComponents()
  if (gitContents.err) {
    console.error(
      `[🤖 ${pc.cyan('@hulla/ui')}]: ${pc.red(
        `Failed to retrieve available components. \n\n Github API returned with following message: ${gitContents.err}.`
      )}`
    )
    process.exit(1)
  }
  const availableComponents = gitContents.res

  s.stop('Retrieved available component library! 📚')
  /* ---------------- Parse which components user wants to add ---------------- */
  let components: string[]
  if (parsedArgs.args.add) {
    for (const component of parsedArgs.args.add) {
      if (!availableComponents.find(({ name }) => name === component)) {
        console.error(
          `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: ${pc.red(
            `Component "${component}" not found in available components. \n\n Are you sure you used a correct name and are using the latest @hulla/ui version? \n Aborting component adding ❌.`
          )}`
        )
        process.exit(1)
      }
    }
    components = parsedArgs.args.add as string[]
  } else {
    components = (await multiselect({
      message: 'Which component would you like to install?',
      options: [
        ...availableComponents.map(({ name }) => {
          const label = capitalizeFirstLetter(name)
          return {
            label,
            value: name,
          }
        }),
      ],
    })) as string[]
    onCancel(components)
  }

  let frameworks: Record<FrameworksKeys, string>
  const setFrameworks = (from: string[]) =>
    from.reduce(
      (res, framework) => ({
        ...res,
        [framework]:
          (parsedArgs.config.frameworks ?? {})[framework as keyof typeof parsedArgs.config.frameworks]?.['extension'] ??
          EXT[framework as keyof typeof EXT],
      }),
      {} as Record<FrameworksKeys, string>
    )

  if (parsedArgs.args.frameworks === undefined) {
    // If arg not specified and only 1 framework in config, just use it
    if (Object.keys(parsedArgs.config.frameworks ?? {}).length === 1) {
      frameworks = setFrameworks(Object.keys(parsedArgs.config.frameworks ?? {}))
    } else {
      // arg not passed and multiple frameworks in config - prompt user to select
      console.info(
        `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  ${announce(
          `These are the frameworks configured in your ${parsedArgs.args.config ?? '.hulla/ui.json'} file. \nIf you need to add a new one run ${pc.cyan('@hulla/ui setup frameworks')} command ${pc.italic('(or run @hulla/ui init to re-initialize the entire config)')}`
        )}`
      )
      const selectedFrameworks = (await multiselect({
        message: 'Which frameworks would you like to install the components for?',
        options: Object.keys(parsedArgs.config.frameworks ?? {}).map((framework) => {
          return {
            label: capitalizeFirstLetter(framework),
            value: framework,
          }
        }),
      })) as string[]
      onCancel(selectedFrameworks)
      frameworks = setFrameworks(selectedFrameworks)
    }
  } else {
    // arg provided - check if it's valid and if so, use it
    const passedFrameworks = (parsedArgs.args.frameworks as string).split(',')
    if (passedFrameworks.some((framework) => !Object.keys(parsedArgs.config.frameworks ?? {}).includes(framework))) {
      console.error(
        `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Unsupported framework detected. Aborting operation. Supported frameworks are ${Object.keys(parsedArgs.config.frameworks ?? {}).join(', ')}.\nIf you need to add a new one run ${pc.cyan('@hulla/ui setup frameworks')} command ${pc.italic('(or run @hulla/ui init to re-initialize the entire config)')}`
      )
      process.exit(1)
    }
    frameworks = setFrameworks(passedFrameworks)
  }
  /* -------------------- Download the generated components ------------------- */

  const deps = new Set<string>()
  const devDeps = new Set<string>()

  const frameworkfiles: GFile[] = await Promise.all(
    Object.entries(frameworks).map(async ([frameworkK, extensionK]) => {
      const framework = frameworkK as FrameworksKeys
      const extension = extensionK as keyof typeof EXT
      return Promise.all(
        components.map(async (component) => {
          const style = parsedArgs.config.style?.solution
          if (!style) {
            console.error(
              `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: No style solution found in config. Aborting operation.`
            )
            return process.exit(1)
          }

          const gitComponents = await git.componentFiles(framework, style, component)
          if (gitComponents.err) {
            console.error(
              `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to fetch component ${component}. \n\n Github API returned with following message: ${gitComponents.err}.`
            )
            process.exit(1)
          }
          const componentFiles = gitComponents.res
          if (componentFiles.some((file) => file.type === 'dir')) {
            console.error(
              `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Unexpected ${component} component structure. Please create a bug report with your config and exact commands. Aborting operation.`
            )
            process.exit(1)
          }
          if (!componentFiles.find((file) => file.name === 'package.json')) {
            console.error(
              `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to fetch component ${component}. No package.json found. Please create a bug report with your ui.json config and exact commands`
            )
            process.exit(1)
          }

          const gitPackageJson = await git.raw<'json', PackageJSON>(framework, style, component, 'package.json', 'json')
          if (gitPackageJson.err) {
            console.error(
              `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to fetch component ${component}. \n\n Github API returned with following message: ${gitPackageJson.err}.`
            )
            process.exit(1)
          }
          const { dependencies, devDependencies, name: packageName } = gitPackageJson.res
          for (const dep of Object.keys(dependencies ?? {})) {
            deps.add(dep)
          }
          for (const devDep of Object.keys(devDependencies ?? {})) {
            devDeps.add(devDep)
          }

          return Promise.all(
            componentFiles
              .filter((file) => file.name !== 'package.json')
              .map(async (gitFile) => {
                const file = await git.raw(framework, style, component, gitFile.name, 'text')
                if (file.err) {
                  console.error(
                    `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to fetch component ${component}. \n\n Github API returned with following message: ${file.err}.`
                  )
                  process.exit(1)
                }
                const dir = replaceTypescriptAlias(
                  parsedArgs.config.typescript!.alias,
                  parsedArgs.config.typescript!.src,
                  join(
                    process.cwd(),
                    (parsedArgs.config.frameworks ?? {})[framework]?.output ?? parsedArgs.config.output!,
                    component
                  )
                )
                return {
                  file: gitFile.name,
                  path: join(dir, `${gitFile.name.split('.')[0]}${extension}`),
                  dir,
                  // if it's an index file, replace the .framework.extension with the user defined framework extension in ui.json
                  content: gitFile.name.includes('index')
                    ? file.res.replaceAll(
                        `.${packageName.split('.')[1]}`,
                        extension.replace('.tsx', '').replace('.ts', '')
                      )
                    : // otherwise update the style import path for component ui exports
                      file.res.replace('@/lib/style', parsedArgs.config.style?.util ?? '@/lib/style'),
                }
              })
          )
        })
      ).then((files) => files.flat())
    })
  ).then((frameworks) => frameworks.flat())

  /* ----------------------------- Write to files ----------------------------- */
  s.start('Adding components ⚡️')
  await Promise.all(
    frameworkfiles.map(async (file) => {
      if (!existsSync(file.dir)) {
        await mkdir(file.dir, { recursive: true }).catch((err) => {
          console.error(
            `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to create directory ${file.dir}. \n\n ${err}`
          )
          process.exit(1)
        })
      }
      return writeFile(file.path, file.content, { flag: 'w' }).catch((err) => {
        console.error(
          `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to write to file ${file.path}. \n\n ${err}`
        )
        process.exit(1)
      })
    })
  )
  s.stop('Added components successfully! ✅')
  /* -------------------------- Install dependencies -------------------------- */
  const installDeps = getInstallCommand(parsedArgs.config.packageManager, Array.from(deps), Array.from(devDeps))
  if (installDeps.length) {
    s.start('Installing dependencies 🤖')
    await promisify(exec)(installDeps).catch((err) => {
      console.error(
        `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to install dependencies. \n\n ${err}`
      )
      process.exit(1)
    })
    s.stop('Dependencies installed! ✅')
  }

  outro(
    `Thank you for using ${pc.cyan('@hulla/ui')}. Check out ${pc.underline(pc.cyan('https://hulla.dev/docs/ui'))} for more info ❤️`
  )
}
