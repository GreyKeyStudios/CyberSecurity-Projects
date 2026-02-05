import Link from "next/link"
import { ArrowRight, Github, Linkedin, FileText, MapPin, Award, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectCard } from "@/components/project-card"
import { Stats } from "@/components/stats"
import { featuredProjects, stats } from "@/lib/projects"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
                  Michael Walton
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Information Technology Professional | SOC / Cybersecurity Analyst
                </p>
                <p className="text-sm text-muted-foreground/70">
                  9+ years IT support experience (10 years in March 2026) | Security+ & CCST Cybersecurity Certified
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg pt-2">
                  Portfolio showcasing hands-on security analysis skills including Splunk log analysis, 
                  threat intelligence automation, and incident investigation workflows. Currently serving as 
                  Store Support Specialist at Amplifon, providing technical support and troubleshooting.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 px-3 py-1">
                  <Award className="h-3 w-3 mr-1" />
                  CompTIA Security+ (2025)
                </Badge>
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 px-3 py-1">
                  <Award className="h-3 w-3 mr-1" />
                  CCST Cybersecurity (2025)
                </Badge>
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 px-3 py-1">
                  <Award className="h-3 w-3 mr-1" />
                  CompTIA A+ (2017)
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4">
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
                <Button asChild variant="ghost" className="gap-2 hover:text-primary hover:bg-primary/10">
                  <Link href="/resume">
                    <FileText className="h-4 w-4" />
                    Resume
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="lg:flex justify-center items-center">
              <div className="w-full max-w-sm space-y-6">
                <Stats total={stats.total} complete={stats.complete} planned={stats.planned} />
                <div className="rounded-lg border border-border bg-card p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">Quick Overview</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      {stats.verified} verified projects with evidence
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      Live API integrations tested
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Real-world incident documentation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div className="space-y-2">
              <Badge variant="outline" className="border-primary text-primary bg-primary/10">
                Featured
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Best Work
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                My most impactful security projects demonstrating core SOC analyst competencies.
              </p>
            </div>
            <Button asChild variant="outline" className="gap-2 border-border hover:border-primary hover:text-primary w-fit bg-transparent">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                description={project.description}
                skills={project.skills}
                tools={project.tools}
                badge={project.badge}
                badgeLabel={project.badgeLabel}
                githubPath={project.githubPath}
                featured={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Skills Overview
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technical capabilities demonstrated across all projects.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Splunk / SIEM", level: "Advanced" },
              { name: "Threat Intelligence", level: "Advanced" },
              { name: "Incident Response", level: "Intermediate" },
              { name: "Python Automation", level: "Intermediate" },
              { name: "Network Analysis", level: "Intermediate" },
              { name: "Log Analysis", level: "Advanced" },
              { name: "Firewall Config", level: "Intermediate" },
              { name: "Documentation", level: "Advanced" },
            ].map((skill) => (
              <div
                key={skill.name}
                className="rounded-lg border border-border bg-card p-4 text-center hover:border-primary/50 transition-colors"
              >
                <h3 className="font-medium text-foreground text-sm">{skill.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{skill.level}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ready to work together?
            </h2>
            <p className="text-muted-foreground">
              {"I'm"} actively seeking SOC Analyst opportunities. {"Let's"} connect and discuss how I can contribute to your security team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="https://www.linkedin.com/in/michael-walton84" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  Connect on LinkedIn
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 border-border hover:border-primary hover:text-primary bg-transparent">
                <Link href="/about">
                  <FileText className="h-4 w-4" />
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
