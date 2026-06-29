/** Redirect target for email confirm, password reset, and magic links. */
export function getAuthConfirmUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "")
  return base ? `${base}/auth/confirm` : "/auth/confirm"
}