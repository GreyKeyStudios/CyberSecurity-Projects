import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ExternalLink, Cloud } from "lucide-react"
import Link from "next/link"

export default function ResumePage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">Resume</h1>
          <p className="text-muted-foreground text-lg">
            Download my resume or view the interactive cloud version
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Download Resume Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Download Resume
              </CardTitle>
              <CardDescription>
                Get the latest PDF version of my resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full gap-2">
                <Link href="/resume.pdf" download>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                PDF format, updated regularly
              </p>
            </CardContent>
          </Card>

          {/* Cloud Resume Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Cloud Resume
              </CardTitle>
              <CardDescription>
                Interactive web version hosted on Azure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="lg" className="w-full gap-2 bg-transparent">
                <Link 
                  href="https://resume.greykeystudios.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Cloud Resume
                </Link>
              </Button>
              <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  Built as part of the{" "}
                  <Link 
                    href="https://cloudresumechallenge.dev/docs/the-challenge/azure/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Cloud Resume Challenge - Azure
                  </Link>
                  . This project demonstrates cloud infrastructure skills including Azure Static Web Apps, 
                  Azure Functions, CosmosDB, and CI/CD with GitHub Actions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
