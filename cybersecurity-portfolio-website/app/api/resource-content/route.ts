import { NextRequest } from "next/server"
import { fetchResourceContent } from "@/lib/resource-content"

export const runtime = "edge"

/** GET /api/resource-content?path=SOC-Notes/Common-Ports-CheatSheet.md
 * Fetches markdown from GitHub server-side so Quick Reference and other in-app content loads without CORS issues.
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path")
  if (!path || path.includes("..")) {
    return new Response("Missing or invalid path", { status: 400 })
  }
  const content = await fetchResourceContent(path)
  if (content == null) {
    return new Response("Content not found", { status: 404 })
  }
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
