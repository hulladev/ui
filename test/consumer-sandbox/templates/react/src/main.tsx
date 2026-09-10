import { Alert, AlertDescription, AlertTitle } from "@/components/alert"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Code } from "@/components/code"
import { Input } from "@/components/input"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

function App() {
  return (
    <main
      data-framework="react"
      className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16"
    >
      <header className="space-y-3">
        <Badge variant="primary">Clean-room React</Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em]">Hulla primitives, installed</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          This page starts without Tailwind or theme wiring and is built only after the packed CLI
          installs the registry.
        </p>
      </header>

      <Card data-testid="card" variant="elevated">
        <CardHeader>
          <CardTitle>Production defaults</CardTitle>
          <CardDescription>
            Every visible control below comes from the generated source.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input aria-label="Project name" placeholder="Project name" />
          <div className="flex flex-wrap gap-3">
            <Button data-testid="button">Create project</Button>
            <Button variant="outline">Read docs</Button>
          </div>
          <Alert variant="important">
            <AlertTitle>Theme active</AlertTitle>
            <AlertDescription>
              Tokens, typography, borders, and focus styles are provided by <Code>styles.css</Code>.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
