import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, BookOpen, ExternalLink, ArrowRight, Github } from "lucide-react"
import resourcesData from "@/data/resources.json"

const GITHUB_BASE_URL = "https://github.com/GreyKeyStudios/CyberSecurity-Projects"

export default function ResourcesPage() {
  const { templates, cheatSheets } = resourcesData

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Professional templates and cheat sheets for SOC analysts. Download and customize for your own use.
          </p>
        </div>

        {/* Templates Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Templates</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Ready-to-use documentation templates for incident response and analysis workflows.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary whitespace-nowrap">
                      Template
                    </span>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild variant="default" className="flex-1 gap-2">
                    <Link href={`/resources/templates/${template.id}`}>
                      View Content
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="icon" className="bg-transparent">
                    <a
                      href={`${GITHUB_BASE_URL}/blob/main/${template.githubPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cheat Sheets Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">SOC Notes & Cheat Sheets</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Quick reference guides for common SOC tasks, queries, and indicators.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cheatSheets.map((sheet) => (
              <Card key={sheet.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{sheet.title}</CardTitle>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground w-fit">
                    Cheat Sheet
                  </span>
                  <CardDescription className="text-muted-foreground text-sm mt-2">
                    {sheet.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild variant="default" size="sm" className="flex-1 gap-2">
                    <Link href={`/resources/cheat-sheets/${sheet.id}`}>
                      View Content
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="icon" className="bg-transparent">
                    <a
                      href={`${GITHUB_BASE_URL}/blob/main/${sheet.githubPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
