import { Check, FlaskConical, ClipboardList, FolderOpen } from "lucide-react"

interface StatsProps {
  total: number
  complete: number
  planned: number
}

export function Stats({ total, complete, planned }: StatsProps) {
  const stats = [
    {
      label: "Total Projects",
      value: total,
      icon: FolderOpen,
      color: "text-primary",
    },
    {
      label: "Verified Complete",
      value: complete,
      icon: Check,
      color: "text-green-400",
    },
    {
      label: "Planned",
      value: planned,
      icon: ClipboardList,
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-center"
        >
          <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
          <span className="text-2xl font-bold text-foreground">{stat.value}</span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
