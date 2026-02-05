import { Check, FlaskConical, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

export type BadgeType = "verified-complete" | "verified-api" | "scaffold"

interface ProjectBadgeProps {
  type: BadgeType
  label?: string
  className?: string
}

const badgeConfig = {
  "verified-complete": {
    icon: Check,
    label: "Verified Complete",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  "verified-api": {
    icon: FlaskConical,
    label: "Verified (API Tested)",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  scaffold: {
    icon: ClipboardList,
    label: "Planned / Scaffold",
    className: "bg-muted text-muted-foreground border-border",
  },
}

export function ProjectBadge({ type, label, className }: ProjectBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
      title={config.label}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{label || config.label}</span>
    </span>
  )
}
