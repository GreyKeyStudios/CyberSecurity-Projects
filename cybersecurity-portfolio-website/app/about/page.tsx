import Link from "next/link"
import { Github, Linkedin, Mail, MapPin, Award, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "About - Michael Walton",
  description: "SOC Analyst portfolio by Michael Walton showcasing cybersecurity skills, certifications, and professional background. 9+ years IT support experience, Security+ and CCST Cybersecurity certified.",
}

const skills = {
  "Security Operations": [
    "Alert Triage",
    "Incident Response",
    "Threat Analysis",
    "IOC Extraction",
    "Ticket Documentation",
  ],
  "SIEM & Log Analysis": [
    "Splunk",
    "SPL Queries",
    "Dashboard Creation",
    "Log Correlation",
    "Alert Configuration",
  ],
  "Network Security": [
    "Wireshark",
    "Packet Analysis",
    "Firewall Configuration",
    "Network Monitoring",
    "Protocol Analysis",
  ],
  "Automation & Tools": [
    "Python",
    "API Integration",
    "Threat Intelligence",
    "Documentation",
    "Git/GitHub",
  ],
}

const certifications = [
  {
    name: "CompTIA Security+",
    status: "Certified 2025",
    icon: Award,
  },
  {
    name: "Cisco CCST Cybersecurity",
    status: "Certified 2025",
    icon: Award,
  },
  {
    name: "CompTIA A+",
    status: "Certified 2017",
    icon: Award,
  },
]

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm">Minneapolis, Minnesota, 55411</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            About Me
          </h1>
          <p className="text-xl text-primary font-medium">
            SOC / Cybersecurity Analyst
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Information Technology Professional with 9+ years of experience (10 years in March 2026) in 
            high-visibility customer service and a strong foundation in security principles, network defense, 
            and threat analysis. Certified in CompTIA Security+ and Cisco CCST Cybersecurity with hands-on 
            experience in IT troubleshooting, incident response, and system administration. Currently serving 
            as Store Support Specialist at Amplifon. This portfolio demonstrates hands-on experience with 
            real-world security scenarios, including Splunk log analysis, threat intelligence automation, 
            and comprehensive incident documentation.
          </p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="https://github.com/GreyKeyStudios/CyberSecurity-Projects" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 border-border hover:border-primary hover:text-primary bg-transparent">
            <Link href="https://www.linkedin.com/in/michael-walton84" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 border-border hover:border-primary hover:text-primary bg-transparent">
            <Link href="mailto:michaelwalton1984@gmail.com">
              <Mail className="h-4 w-4" />
              Email
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 border-border hover:border-primary hover:text-primary bg-transparent">
            <Link href="https://resume.greykeystudios.com" target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" />
              Portfolio Website
            </Link>
          </Button>
        </div>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Certifications</h2>
          <div className="grid gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <cert.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.status}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Matrix */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Skills Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <div
                key={category}
                className="rounded-lg border border-border bg-card p-6"
              >
                <h3 className="font-medium text-foreground mb-4">{category}</h3>
                <ul className="space-y-2">
                  {skillList.map((skill) => (
                    <li key={skill} className="flex items-center gap-3 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Resume CTA */}
        <section className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Looking for my resume?
          </h2>
          <p className="text-muted-foreground mb-6">
            Download my full resume or view the interactive cloud version.
          </p>
          <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/resume">
              <FileText className="h-4 w-4" />
              View Resume
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
