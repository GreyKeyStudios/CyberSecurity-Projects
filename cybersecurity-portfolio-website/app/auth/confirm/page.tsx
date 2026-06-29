"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

function AuthConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Confirming your email…")
  const [isError, setIsError] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const confirm = async () => {
      const code = searchParams.get("code")
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as "signup" | "email" | "recovery" | "invite" | "email_change",
          })
          if (error) throw error
        } else {
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) throw error
          if (!session) {
            throw new Error("Confirmation link is invalid or expired. Try signing in or request a new email.")
          }
        }

        setMessage("Email confirmed! Redirecting to SOC OS…")
        setTimeout(() => router.replace("/resources"), 1500)
      } catch (err: unknown) {
        setIsError(true)
        setMessage(err instanceof Error ? err.message : "Could not confirm your email.")
      }
    }

    confirm()
  }, [searchParams, supabase.auth, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      {!isError && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
      <p className={isError ? "text-destructive max-w-md" : "text-muted-foreground max-w-md"}>{message}</p>
      {isError && (
        <a href="/resources" className="text-sm text-primary underline">
          Back to SOC OS
        </a>
      )}
    </div>
  )
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthConfirmContent />
    </Suspense>
  )
}
