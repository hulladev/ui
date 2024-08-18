import { useState } from 'react'
import { Switch } from './ui/switch.tsx'

export function ChangeTheme() {
  const [checked, setChecked] = useState(false)

  const onToggle = () => {
    if (checked) {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
      setChecked(false)
    } else {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
      setChecked(true)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-shadow-500 text-sm">Dark mode</span>
      <Switch checked={checked} onClick={onToggle} />
    </div>
  )
}
