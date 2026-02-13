import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText, BookOpen, AlertTriangle, AlertCircle, Info, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getGitHubBlobUrl } from "@/lib/utils"

export const metadata: Metadata = {
  title: "SOC Casefiles",
  description: "Real-world incident investigation workflows demonstrating alert triage, IOC extraction, and ticket documentation skills.",
}

const casefiles = [
  {
    id: "001-phishing-triage",
    title: "001 - Phishing Triage",
    severity: "high",
    description: "Email header analysis, IOC extraction, verdict, and containment procedures for phishing incidents.",
    skills: ["Email Header Analysis", "IOC Extraction", "Threat Intelligence", "Containment"],
    githubPath: "SOC-Casefiles/001-Phishing-Triage/README.md",
  },
  {
    id: "002-brute-force-login",
    title: "002 - Brute Force Login",
    severity: "high",
    description: "Authentication logs analysis, IP intelligence gathering, and conclusion documentation for brute force attacks.",
    skills: ["Log Analysis", "IP Intelligence", "Attack Detection", "Incident Response"],
    githubPath: "SOC-Casefiles/002-Brute-Force-Login/README.md",
  },
  {
    id: "003-malware-edr-alert",
    title: "003 - Malware/EDR Alert",
    severity: "critical",
    description: "Artifact review, scope determination, and escalation notes for malware detection alerts.",
    skills: ["Malware Analysis", "EDR Analysis", "Containment", "Escalation"],
    githubPath: "SOC-Casefiles/003-Malware-EDR-Alert/README.md",
  },
  {
    id: "004-impossible-travel",
    title: "004 - Impossible Travel",
    severity: "medium",
    description: "Identity event triage and recommendations for impossible travel detection scenarios.",
    skills: ["Identity Analysis", "Geolocation Analysis", "Access Control", "User Verification"],
    githubPath: "SOC-Casefiles/004-Impossible-Travel/README.md",
  },
  {
    id: "005-splunk-failed-login",
    title: "005 - Splunk Failed Login Triage ⭐",
    severity: "high",
    description: "Real-world Splunk log analysis for failed login attempts using actual evidence from the Log Analysis project.",
    skills: ["Splunk", "SPL Queries", "Log Analysis", "Dashboard Analysis"],
    githubPath: "SOC-Casefiles/005-Splunk-Failed-Login-Triage/README.md",
  },
]

const playbooks = [
  {
    id: "phishing-response",
    title: "Phishing Response Playbook",
    description: "Step-by-step procedures for investigating and responding to phishing incidents.",
    githubPath: "SOC-Casefiles/_Playbooks/Phishing-Response-Playbook.md",
  },
  {
    id: "brute-force-response",
    title: "Brute Force Response Playbook",
    description: "Detection, analysis, and response procedures for brute force attacks.",
    githubPath: "SOC-Casefiles/_Playbooks/Brute-Force-Response-Playbook.md",
  },
  {
    id: "malware-containment",
    title: "Malware Containment Playbook",
    description: "Containment, eradication, and recovery procedures for malware infections.",
    githubPath: "SOC-Casefiles/_Playbooks/Malware-Containment-Playbook.md",
  },
  {
    id: "impossible-travel",
    title: "Impossible Travel Playbook",
    description: "Response procedures for impossible travel detection and identity verification.",
    githubPath: "SOC-Casefiles/_Playbooks/Impossible-Travel-Playbook.md",
  },
]

function SeverityBadge({ severity }: { severity: string }) {
  const config = {
    critical: { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertTriangle },
    high: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: AlertCircle },
    medium: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Info },
    low: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Info },
  }
  const { color, icon: Icon } = config[severity as keyof typeof config] || config.medium

  return (
    <Badge variant="outline" className={`${color} gap-1`}>
      <Icon className="h-3 w-3" />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  )
}

export default function CasefilesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            SOC Casefiles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Real-world incident investigation workflows demonstrating alert triage, 
            IOC extraction, and ticket documentation skills.
          </p>
        </div>

        {/* Investigation Casefiles */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Investigation Casefiles</h2>
          </div>
          <div className="grid gap-4">
            {casefiles.map((casefile) => (
              <Card key={casefile.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg text-foreground">{casefile.title}</CardTitle>
                      <CardDescription className="mt-1">{casefile.description}</CardDescription>
                    </div>
                    <SeverityBadge severity={casefile.severity} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {casefile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
                      <a
                        href={getGitHubBlobUrl(casefile.githubPath)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on GitHub
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Response Playbooks */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Response Playbooks</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {playbooks.map((playbook) => (
              <Card key={playbook.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{playbook.title}</CardTitle>
                  <CardDescription>{playbook.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
                    <a
                      href={getGitHubBlobUrl(playbook.githubPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Playbook
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
