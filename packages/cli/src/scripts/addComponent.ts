import { intro, outro } from '@clack/prompts'
import pc from 'picocolors'
import { intros } from '../lib/constants'

export const addComponent = async (config) => {
  const randomIntro = intros[Math.floor(Math.random() * intros.length)]
  intro(`[${pc.cyan('🤖 @hulla/ui')}]: ${randomIntro}`)
  outro(
    `Thank you for using ${pc.cyan('@hulla/ui')}. Check out ${pc.underline(pc.cyan('https://hulla.dev/docs/ui'))} for more info ❤️`
  )
}
