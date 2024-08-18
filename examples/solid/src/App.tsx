import type { Component } from 'solid-js'
import { Button } from './components/button'

const App: Component = () => {
  return (
    <div class="bg-primary">
      <Button variant="primary">Hello World</Button>
    </div>
  )
}

export default App
