import { confirm, group, intro, multiselect, outro, select, spinner, text, type PromptGroup } from '@clack/prompts'
import { tsConfigSetup } from 'codemods'
import { exec, type ExecException } from 'node:child_process'
import { existsSync } from 'node:fs'
import { access, constants as fsConstants, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import pc from 'picocolors'
import { extensions as EXT, supported_frameworks } from '../lib/constants'
import type { Config, FrameworksKeys, PackageManagers, StyleKeys } from '../lib/types'
import { SYMBOL, announce, capitalizeFirstLetter, onCancel, propose } from '../utils/cli'
import { attemptFile, cycleExtension, extractDeps, getMajorVersion, getSetupInstallCommand } from '../utils/fs'
import { keys } from '../utils/objects'

export const setup = async () => {
  intro(announce(`Hello, I'm your CLI assistant! Let's setup your project first!`))

  /* -------------- Detect preferred answers from users codespace ------------- */
  const s = spinner()
  s.start(
    `Analyzing your project ${pc.italic('(accessing package.json, .lock files and framework .config files)')}... 🔍`
  )

  const detectedDependencies = await extractDeps(
    { value: 'react', query: 'react' },
    { value: 'react-native', query: 'react-native' },
    { value: 'astro', query: 'astro' },
    { value: 'solid', query: 'solid-js' },
    { value: 'tailwind', query: 'tailwindcss' },
    { value: 'stylex', query: '@stylexjs/stylex' },
    { value: 'tailwind-merge', query: 'tailwind-merge' }
  )

  const detectedPackageManager = (
    await Promise.all([
      attemptFile('bun.lockb', 'bun'),
      attemptFile('pnpm-lock.yaml', 'pnpm'),
      attemptFile('yarn.lock', 'yarn'),
      attemptFile('package-lock.json', 'npm'),
    ]).then((arr) => arr.filter(Boolean))
  )[0]

  const detectedFramework = (
    await Promise.all([
      ...cycleExtension('astro.config', 'astro'),
      ...cycleExtension('next.config', 'react'),
      ...cycleExtension('remix.confug', 'react'),
    ]).then((arr) => arr.filter(Boolean))
  )[0]

  const detectedStyle = (
    await Promise.all([...cycleExtension('tailwind.config', 'tailwind')]).then((arr) => arr.filter(Boolean))
  )[0]
  s.stop('Finished analyzing your project! 🧠')

  /* ------------- Utility helper for create select prompt options ------------ */
  const option =
    <T extends 'frameworks' | 'style' | 'packageManager'>(
      type: T,
      labelStyle: 'exact' | 'capitalized' = 'capitalized'
    ) =>
    (
      value: T extends 'frameworks' ? FrameworksKeys : T extends 'style' ? StyleKeys : PackageManagers,
      label: string = labelStyle === 'exact' ? value : capitalizeFirstLetter(value.replaceAll('-', ' '))
    ) => {
      const detected =
        type === 'frameworks' ? detectedFramework : type === 'style' ? detectedStyle : detectedPackageManager
      return {
        value,
        label:
          value === detected?.result
            ? `${label} (💡 detected ${detected.query})`
            : keys(detectedDependencies).includes(value)
              ? `${label} (💡 detected in package.json)`
              : label,
      }
    }

  /* ------------------------- Package manager prompt ------------------------- */
  const packageOption = option('packageManager', 'exact')
  const packageManager = await select({
    message: `Which package manager are you using? 📦`,
    initialValue: detectedPackageManager?.result,
    options: [packageOption('pnpm'), packageOption('bun'), packageOption('npm'), packageOption('yarn')],
  })
  onCancel(packageManager)

  /* ------------------------------- Config path ------------------------------ */
  let path = ((await text({
    message: 'Where will be your configuration file located? ⚙️',
    placeholder: '.hulla/ui.json (Recommended)',
  })) ?? '.hulla/ui.json') as string
  onCancel(path)

  try {
    await access(`${process.cwd()}/${path}`, fsConstants.F_OK)
    const overwrite = await confirm({
      message: `File ${path} already exists! Are you sure you want to over-write it? 🚧`,
    })
    if (!overwrite) {
      console.info(
        `\n${pc.gray('┌')} ${announce(`No problem, please either write a new name or "${pc.red('abort')}" if you wish to abort setup`)}`
      )
      path = ((await text({
        message: 'Where will be your configuration file located? ⚙️',
        placeholder: `abort ${pc.italic('(leave setup)')}`,
      })) ?? 'abort') as string
      if (path === 'abort') {
        outro(
          `Thank you for using ${pc.cyan('@hulla/ui')}. Check out ${pc.underline(pc.cyan('https://hulla.dev/docs/ui'))} for more info ❤️`
        )
        process.exit()
      }
    }
  } catch {
    // it's okay that the config doesn't already exist, we'll just create a new one
  }

  /* ----------------------------- Output location ---------------------------- */

  const tsconfig = ((await text({
    message: 'Where is your tsconfig located? 📄',
    placeholder: './tsconfig.json',
  })) ?? './tsconfig.json') as string

  let src = ((await text({
    message: 'Where is  is your source code located? 🗂️',
    placeholder: './src',
  })) ?? './src') as string
  onCancel(src)
  src = src.endsWith('/') ? src : `${src}/`

  let alias = ((await text({
    message: `Which path alias do you want to use for your source code (${src}) location? 📁`,
    placeholder: '@/',
  })) ?? '@/') as string
  onCancel(alias)
  alias = alias.endsWith('/') ? alias : `${alias}/`

  const tsconfigCodemod = await tsConfigSetup({ path: tsconfig, src, alias })
  await propose(tsconfigCodemod)

  const output = ((await text({
    message: 'Where do you want to add your components? 🗂️',
    placeholder: `${alias}components`,
  })) ?? `${alias}components`) as string
  onCancel(output)

  /* ------------------------------- Frameworks ------------------------------- */
  const frameworkOption = option('frameworks')
  const frameworkInitial = await select({
    message: 'Which framework are you using? 🤔',
    initialValue:
      detectedFramework?.result ??
      keys(detectedDependencies).find((key) => supported_frameworks.includes(key as FrameworksKeys)),
    options: [
      frameworkOption('react'),
      frameworkOption('react-native'),
      frameworkOption('solid'),
      frameworkOption('astro'),
    ],
  })
  onCancel(frameworkInitial)

  const frameworks = [frameworkInitial]

  /* --------------------- Followup - combined frameworks --------------------- */
  if (frameworkInitial === 'astro') {
    console.info(`${pc.gray(SYMBOL.bar)} ${announce(`Don't select any option if you only use .astro files`)}`)
    const frameworkExtra = (await multiselect({
      message: 'Are you using Astro in combination with other framework?',
      initialValues: detectedFramework?.result
        ? [detectedFramework?.result]
        : keys(detectedDependencies).filter((key) => supported_frameworks.includes(key as FrameworksKeys)),
      options: [frameworkOption('react'), frameworkOption('solid')],
    })) as FrameworksKeys[]
    frameworkExtra.forEach((framework) => frameworks.push(framework))
    onCancel(frameworkExtra)
  }

  /* ------------------------------ RSC for react ----------------------------- */
  let rsc = 'false'
  if (frameworks.includes('react')) {
    const majorVersionDetected = detectedDependencies['react'] && getMajorVersion(detectedDependencies['react'])
    if (!majorVersionDetected || majorVersionDetected >= 18) {
      rsc = (await select({
        message: 'Do you use React Server Components? 🧪',
        options: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ],
      })) as string
      onCancel(rsc)
    }
  }

  const customExtensions = await confirm({
    message: 'Do you want to customize the file extensions for your components? 📝',
    initialValue: false,
  })

  const extensions: Record<FrameworksKeys, string> = frameworks.reduce(
    (res, framework) => ({
      ...res,
      [framework]: EXT[framework as FrameworksKeys],
    }),
    {} as Record<FrameworksKeys, string>
  )
  if (customExtensions) {
    for await (const [framework, extension] of Object.entries(extensions)) {
      const newExtension = ((await text({
        message: `Enter the file extension for ${framework} components:`,
        placeholder: extension,
      })) ?? extension) as string
      onCancel(newExtension)
      extensions[framework as FrameworksKeys] = newExtension
    }
  }

  /* ----------------------------- Styling options ---------------------------- */
  // TODO: Uncomment these lines once more styling solution sare added, for now we only support tailwind
  // const styleOption = option('style')
  const stylePrompt = await group(
    {
      // solution: () =>
      //   select({
      //     message: 'Which styling solution are you using? 🎨',
      //     initialValue: detectedStyle as StyleKeys | undefined,
      //     options: [
      //       styleOption('tailwind', 'Tailwindcss'),
      //       styleOption('stylex'),
      //       styleOption('inline', frameworks.includes('react-native') ? 'Inline styles / Stylesheet' : 'Inline styles'),
      //       // we filter out stylex for react-native because it's not supported yet
      //     ].filter((item) => (item.value === 'stylex' ? (frameworks.includes('react-native') ? false : true) : true)),
      //   }),
      config: () =>
        // config: ({ results }) =>
        text({
          message: `Where will be your tailwind configuration file located? 📁`,
          placeholder: `./tailwind.config.ts`,
          // message: `Where will be your ${results.solution} configuration file located? 📁`,
          // placeholder: `./${results.solution}.config.ts`,
        }) as Promise<string>,
      globals: () =>
        text({
          message: 'Where will be your globals.css style import be located? 📁',
          placeholder: `${alias}assets/globals.css`,
        }),
      util: () => text({ message: 'Where will be your style util file located? 📁', placeholder: `${alias}lib/style` }),
    } as PromptGroup<{
      // solution: symbol | 'tailwind' | 'stylex' | 'inline'
      config: string
      globals: string
      util: string
    }>,
    {
      onCancel,
    }
  )
  const style = {
    ...stylePrompt,
    solution: 'tailwind' as const satisfies StyleKeys,
  }

  if (style.globals === undefined) {
    style.globals = `${alias}assets/globals.css`
  }
  if (style.config === undefined) {
    style.config = `./${style.solution}.config.ts`
  }
  if (style.util === undefined) {
    style.util = `${alias}lib/style`
  }

  /* ---------------- Followup install nativewind if necessary ---------------- */
  if (frameworks.includes('react-native')) {
    if (style.solution === 'tailwind') {
      const confirmframework = await confirm({
        message:
          'Using tailwind with react-native requires you to install `nativewind`.\n\n \t\t> https://www.nativewind.dev/ \n\n Have you installed it and are ready to proceed?',
      })
      onCancel(confirmframework)
    }
    // atm this prompt never shows since we filter the stylex option out above for react-native.
    // Waiting for official mention on stylex docs, before recommending it here
    // if (style.solution === 'stylex') {
    //   const confirmStyle = await confirm({
    //     message:
    //       'Using stylex with react-native requires you to install `react-native-stylex`.\n\n https://github.com/retyui/react-native-stylex',
    //   })
    //   onCancel(confirmStyle)
    // }
  }

  const githubProtocol = await select({
    message: 'Which protocol do you want to use for GitHub communication? 🌐',
    initialValue: 'api',
    options: [
      { value: 'https', label: 'HTTPS' },
      { value: 'api', label: 'GitHub CLI (recommended)' },
    ],
  })
  onCancel(githubProtocol)

  if (githubProtocol === 'api') {
    console.info(
      `${SYMBOL.bar}\n${SYMBOL.bar} 💡 ${pc.cyan(`Please make sure you have the gh CLI installed. ${pc.underline('https://cli.github.com/')}`)}`
    )
  }

  const configFile: Config = {
    output,
    packageManager: packageManager as Exclude<symbol, typeof packageManager>,
    typescript: {
      src,
      alias,
      tsconfig,
    },
    githubProtocol: githubProtocol as 'https' | 'api',
    frameworks: extensions,
    ...(frameworks.includes('react') ? { rsc: rsc as 'true' | 'false' } : {}),
    style,
  }
  const defaultCommand = getSetupInstallCommand(configFile as Config, detectedDependencies)
  const installNow = await confirm({
    message: `Do you want to install the dependencies now? 🍱 (Recommended)`,
  })
  onCancel(installNow)
  if (installNow) {
    const command = ((await text({
      message: `What command do you want to use to install dependencies? 👷`,
      placeholder: `${defaultCommand}`,
    })) ?? defaultCommand) as string
    onCancel(command)
    s.start(`Installing dependencies... 🔧`)
    let didFail = false
    await promisify(exec)(command).catch((err: ExecException) => {
      didFail = true
      console.error(
        `${pc.gray(`\n|\n${SYMBOL.end}`)}  ${announce(`Error installing dependencies! Receied the following error: \n\n${pc.red(err.message)}\n${pc.red(err.stdout)}`)}`
      )
    })
    s.stop(
      didFail
        ? `${announce(`${pc.yellow('Automatic installation failed, please install dependencies manually or retry the setup ⚠️')}`)}`
        : `${announce(`Finished installing dependencies! 🥳`)}`
    )
  }

  /* --------------------------- Create config file --------------------------- */
  s.start(`Creating necessary files... 📁`)
  s.message(`Creating your configuration file in ${pc.bgCyan(path)}`)
  await writeFile(`${process.cwd()}/${path}`, JSON.stringify(configFile, null, 2))
  s.message(`Creating your style util file in ${pc.bgCyan(style.util)}`)
  const stylePath = join(process.cwd(), style.util.replace(alias, src))
  if (!existsSync(stylePath)) {
    await mkdir(stylePath.split('/').slice(0, -1).join('/'), { recursive: true })
  }
  const styleFilePath = stylePath.includes('.ts') ? stylePath : `${stylePath}.ts`
  await writeFile(
    styleFilePath,
    `import { style } from '@hulla/style'

export const { cn, vn } = style()
`,
    { flag: 'w' }
  )
  s.stop(`Finished setting up configuration! 🎉`)
  outro(
    `Thank you for using ${pc.cyan('@hulla/ui')} ❤️\n\n Run the command again to add components or check out ${pc.underline(pc.cyan('https://hulla.dev/docs/ui'))} for more info `
  )
}
