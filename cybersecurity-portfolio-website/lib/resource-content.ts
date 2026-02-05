// Resource content fetching utilities

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main"

export async function fetchResourceContent(githubPath: string): Promise<string | null> {
  try {
    const url = `${GITHUB_RAW_BASE}/${githubPath}`
    const response = await fetch(url, { 
      next: { revalidate: 3600 } // Cache for 1 hour, allows static generation
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
      return null
    }
    
    const text = await response.text()
    
    // Check if we got actual content (not a 404 page or error)
    if (text.length < 50 || text.includes('404') || text.includes('Not Found')) {
      console.error(`Received invalid content for ${githubPath}`)
      return null
    }
    
    return text
  } catch (error) {
    console.error(`Failed to fetch resource content for ${githubPath}:`, error)
    return null
  }
}

export function getResourceGitHubUrl(githubPath: string): string {
  return `https://github.com/GreyKeyStudios/CyberSecurity-Projects/blob/main/${githubPath}`
}
