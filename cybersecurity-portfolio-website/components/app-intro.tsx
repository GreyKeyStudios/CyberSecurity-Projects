"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"

interface AppIntroProps {
  /** App id for lookup in appIntros, or pass body directly */
  appId?: string
  /** Override: intro body (supports simple markdown-like **bold**) */
  body?: string
  /** Section title, e.g. "How to use" or "What is this?" */
  title?: string
  /** If true, render as collapsible (default open on first visit is optional) */
  collapsible?: boolean
  /** appIntros map from data (keyed by app id) */
  appIntros?: Record<string, string>
}

function boldify(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>
    return part
  })
}

export function AppIntro({ appId, body, title = "How to use", collapsible = true, appIntros }: AppIntroProps) {
  const resolvedBody = body ?? (appId && appIntros?.[appId])
  const [open, setOpen] = useState(true)

  if (!resolvedBody) return null

  const content = (
    <p className="text-sm text-muted-foreground">{boldify(resolvedBody)}</p>
  )

  if (!collapsible) {
    return (
      <Card className="border-primary/20 bg-primary/5 mb-4">
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
              {content}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-4">
      <Card className="border-primary/20 bg-primary/5">
        <CollapsibleTrigger asChild>
          <button type="button" className="w-full flex items-center gap-2 p-3 text-left hover:bg-muted/30 rounded-t-lg transition-colors">
            <HelpCircle className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">{title}</span>
            {open ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-3">
            {content}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
