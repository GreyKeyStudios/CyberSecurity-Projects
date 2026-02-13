export default function ProjectLoading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          {/* Back link skeleton */}
          <div className="h-4 w-32 bg-muted rounded" />

          {/* Title skeleton */}
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-muted rounded" />
            <div className="h-5 w-full bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-4">
            <div className="h-10 w-40 bg-muted rounded-md" />
            <div className="h-10 w-36 bg-muted rounded-md" />
          </div>

          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-6 w-40 bg-muted rounded" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-muted rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-muted rounded-md" />
                ))}
              </div>
            </div>
          </div>

          {/* Documentation skeleton */}
          <div className="space-y-4 mt-12">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
