import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Github, FileText, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MarkdownContent } from "@/components/markdown-content"
import { readResourceContentFromBuild, getResourceGitHubUrl } from "@/lib/resource-content"
import resourcesData from "@/data/resources.json"

interface ResourcePageProps {
  params: Promise<{ type: string; id: string }>
}

export async function generateStaticParams() {
  const { templates, cheatSheets } = resourcesData
  
  const templateParams = templates.map((template) => ({
    type: "templates",
    id: template.id,
  }))
  
  const cheatSheetParams = cheatSheets.map((sheet) => ({
    type: "cheat-sheets",
    id: sheet.id,
  }))
  
  return [...templateParams, ...cheatSheetParams]
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { type, id } = await params
  
  const { templates, cheatSheets } = resourcesData
  
  let resource
  if (type === "templates") {
    resource = templates.find((t) => t.id === id)
  } else if (type === "cheat-sheets") {
    resource = cheatSheets.find((s) => s.id === id)
  }
  
  if (!resource) {
    notFound()
  }
  
  const content = await readResourceContentFromBuild(resource.githubPath)
  const githubUrl = getResourceGitHubUrl(resource.githubPath)
  
  const isTemplate = type === "templates"
  const Icon = isTemplate ? FileText : BookOpen
  
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {resource.title}
              </h1>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
              {isTemplate ? "Template" : "Cheat Sheet"}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {resource.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              View on GitHub
            </Link>
          </Button>
        </div>

        {/* Content */}
        {content && content.trim().length > 0 ? (
          <div className="rounded-lg border border-border bg-card p-6">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground mb-2">
              Content could not be loaded.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              The file may be missing or the path may be incorrect.
            </p>
            <Button asChild variant="outline" className="gap-2">
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
            <div className="mt-6 p-4 bg-muted rounded-lg text-left">
              <p className="text-xs text-muted-foreground font-mono break-all">
                Path: {resource.githubPath}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
