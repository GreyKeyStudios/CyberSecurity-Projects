"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { ProjectBadge, type BadgeType } from "@/components/project-badge"
import { Stats } from "@/components/stats"
import { projects, stats, categories } from "@/lib/projects"
import { Button } from "@/components/ui/button"

type FilterType = "all" | "verified" | "planned"

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "verified" && (project.badge === "verified-complete" || project.badge === "verified-api")) ||
      (activeFilter === "planned" && project.badge === "scaffold")

    const matchesCategory = activeCategory === "all" || project.category === activeCategory

    return matchesFilter && matchesCategory
  })

  const filters: { key: FilterType; label: string; badge?: BadgeType }[] = [
    { key: "all", label: "All Projects" },
    { key: "verified", label: "Verified", badge: "verified-complete" },
    { key: "planned", label: "Planned", badge: "scaffold" },
  ]

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            All Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse all cybersecurity projects with complete documentation, working code, and verified evidence.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 max-w-md">
          <Stats total={stats.total} complete={stats.complete} planned={stats.planned} />
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.key)}
                className={
                  activeFilter === filter.key
                    ? "bg-primary text-primary-foreground"
                    : "border-border hover:border-primary hover:text-primary bg-transparent"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("all")}
              className={activeCategory === "all" ? "bg-secondary" : ""}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "bg-secondary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects match the selected filters.</p>
            <Button
              variant="link"
              onClick={() => {
                setActiveFilter("all")
                setActiveCategory("all")
              }}
              className="text-primary"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
