import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldAlert } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <ShieldAlert className="h-16 w-16 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">404</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Page not found. The resource you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  )
}
