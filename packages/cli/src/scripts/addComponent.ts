import { confirm, intro, multiselect, outro, spinner } from '@clack/prompts'
import { exec } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import pc from 'picocolors'
import { promisify } from 'util'
import { extensions as EXT, GH_API, intros } from '../lib/constants'
import type { FrameworksKeys, ParsedArgs } from '../lib/types'
import { SYMBOL, announce, capitalizeFirstLetter, onCancel } from '../utils/cli'

type GFile = {
  text: () => Promise<string> | string
  ok: boolean
  component: string
  framework: string
  extension: string
}

export const addComponent = async (parsedArgs: ParsedArgs) => {
  const randomIntro = intros[Math.floor(Math.random() * intros.length)]
  intro(announce(`${randomIntro}`))
  /* ------------ Fetch available components from the cache or repo ----------- */
  const s = spinner()
  s.start('Checking available components...')
  let availableComponentsResponse: Response = { ok: false } as Response
  let availableComponents: { name: string }[] = []
  if (parsedArgs.config.githubProtocol === 'api') {
    await promisify(exec)(GH_API.api.content)
      .then((res) => {
        availableComponents = (JSON.parse(res.stdout) as { name: string }[]).map(({ name }) => ({ name }))
        availableComponentsResponse = {
          ok: true,
        } as Response
      })
      .catch((err) => {
        availableComponentsResponse = {
          ok: false,
        } as Response
        availableComponents = {
          // @ts-expect-error overriding expected type
          message: err.message,
        }
      })
  } else {
    availableComponentsResponse = await fetch(GH_API.https.content)
    availableComponents = (await availableComponentsResponse.json()) as { name: string }[]
  }
  if (!availableComponentsResponse.ok) {
    const error = (availableComponents as unknown as { message: string }).message
    console.error(
      `[🤖 ${pc.cyan('@hulla/ui')}]: ${pc.red(
        `Failed to retrieve available components. \n\n Github API returned with following message: ${error}.`
      )}`
    )
    s.stop('Failed to retrieve available components. ❌')
    process.exit(1)
  }
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
  const frameworks =
    parsedArgs.args.frameworks !== undefined
      ? (parsedArgs.args.frameworks as string).split(',').reduce(
          (res, framework) => ({
            ...res,
            [framework]:
              (parsedArgs.config.frameworks ?? {})[framework as keyof typeof parsedArgs.config.frameworks] ??
              EXT[framework as keyof typeof EXT],
          }),
          {} as Record<FrameworksKeys, string>
        )
      : parsedArgs.config.frameworks ?? EXT
  const added: Record<string, GFile> = {}
  /* -------------------- Download the generated components ------------------- */
  for (let i = 0; i < Object.keys(frameworks).length; i++) {
    const framework = Object.keys(frameworks)[i]
    const extension = frameworks[framework as FrameworksKeys]
    if (!extension) {
      console.error(
        `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Unsupported framework "${pc.red(framework)}" detected. Aborting operation. Supported frameworks are ${Object.keys(EXT).join(', ')}`
      )
      process.exit(1)
    }

    // Map over components and fetch them
    const files: GFile[] = await Promise.all(
      components.map((component) => {
        // Found already a preferenced framework for this component
        if (added[component]) {
          return added[component]
        }
        // github api version
        if (parsedArgs.config.githubProtocol === 'api') {
          return promisify(exec)(GH_API.api.raw(`${framework}/${parsedArgs.config.style}/${component}${extension}`))
            .catch((err) => {
              console.error(
                `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to fetch component ${component}. \n\n Github API returned with following message: ${err.message}.`
              )
              process.exit(1)
            })
            .then((res) => {
              return {
                ok: true,
                text: () => res.stdout,
                component,
                framework: framework,
                extension,
              } satisfies GFile
            })
        }
        // https version
        return fetch(GH_API.https.raw(`${framework}/${parsedArgs.config.style}/${component}${extension}`))
          .then(
            (res) =>
              ({
                ok: res.ok,
                text: () => res.text(),
                component,
                framework: framework,
                extension,
              }) satisfies GFile
          )
          .catch((err) => {
            console.error(
              `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to fetch component ${component}. \n\n Github API returned with following message: ${err.message}.`
            )
            process.exit(1)
          })
      })
    )

    files.forEach((file) => {
      if (!file.ok) {
        console.error(
          `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to fetch component ${file.component} for framework ${file.framework}. \n\n Github API returned with following message: ${file.text}.`
        )
        process.exit(1)
      }
      added[file.component] = file
    })
  }

  s.start('Adding components...')
  /* ----------------------------- Write to files ----------------------------- */
  for (const [component, file] of Object.entries(added)) {
    let canWrite = true
    if (existsSync(join(process.cwd(), parsedArgs.config.output!))) {
      canWrite = (await confirm({
        message: `File ${component} already exists. Are you sure you want to overwrite it? ❓`,
      })) as boolean
    }
    if (!canWrite) {
      console.info(`Skipping component ${component} ⏩`)
      continue
    }
    try {
      if (!existsSync(join(process.cwd(), parsedArgs.config.output!))) {
        await mkdir(join(process.cwd(), parsedArgs.config.output!), { recursive: true })
      }
      await writeFile(
        join(process.cwd(), parsedArgs.config.output!, `${component}${file.extension}`),
        await file.text(),
        { flag: 'w' }
      )
    } catch (err) {
      console.error(
        `${pc.gray(SYMBOL.bar)}\n${pc.gray(SYMBOL.end)}  [🤖 ${pc.cyan('@hulla/ui')}]: Failed to write component ${component} to disk. \n\n Node.js returned with following message: ${(err as Error).message}.`
      )
      process.exit(1)
    }
  }
  s.stop('Added components successfully! ✅')

  outro(
    `Thank you for using ${pc.cyan('@hulla/ui')}. Check out ${pc.underline(pc.cyan('https://hulla.dev/docs/ui'))} for more info ❤️`
  )
}
