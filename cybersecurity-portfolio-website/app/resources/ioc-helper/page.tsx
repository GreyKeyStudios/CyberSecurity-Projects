"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ExternalLink, 
  Copy, 
  CheckCheck,
  AlertCircle,
  Shield,
  FileText,
  Globe,
  Hash
} from "lucide-react"

type IOCType = "ip" | "domain" | "url" | "hash" | "unknown"

interface IOCResult {
  value: string
  type: IOCType
  links: Array<{
    name: string
    url: string
    description: string
  }>
}

export default function IOCHelperPage() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<IOCResult | null>(null)
  const [copied, setCopied] = useState(false)

  const detectIOCType = (value: string): IOCType => {
    const cleanValue = value.trim()
    
    // IP Address (IPv4)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (ipRegex.test(cleanValue)) {
      return "ip"
    }
    
    // Hash (MD5, SHA1, SHA256)
    const md5Regex = /^[a-fA-F0-9]{32}$/
    const sha1Regex = /^[a-fA-F0-9]{40}$/
    const sha256Regex = /^[a-fA-F0-9]{64}$/
    if (md5Regex.test(cleanValue) || sha1Regex.test(cleanValue) || sha256Regex.test(cleanValue)) {
      return "hash"
    }
    
    // URL (contains http:// or https://)
    if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://")) {
      return "url"
    }
    
    // Domain (contains dot and valid TLD)
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
    if (domainRegex.test(cleanValue)) {
      return "domain"
    }
    
    return "unknown"
  }

  const generateLinks = (value: string, type: IOCType): IOCResult["links"] => {
    const encodedValue = encodeURIComponent(value)
    
    const commonLinks = [
      {
        name: "VirusTotal",
        url: type === "ip" 
          ? `https://www.virustotal.com/gui/ip-address/${value}`
          : type === "domain"
          ? `https://www.virustotal.com/gui/domain/${value}`
          : type === "url"
          ? `https://www.virustotal.com/gui/url/${btoa(value)}`
          : `https://www.virustotal.com/gui/file/${value}`,
        description: "Multi-engine malware scanner"
      }
    ]

    if (type === "ip") {
      return [
        ...commonLinks,
        {
          name: "AbuseIPDB",
          url: `https://www.abuseipdb.com/check/${value}`,
          description: "IP abuse reports database"
        },
        {
          name: "AlienVault OTX",
          url: `https://otx.alienvault.com/indicator/ip/${value}`,
          description: "Threat intelligence platform"
        },
        {
          name: "Cisco Talos",
          url: `https://talosintelligence.com/reputation_center/lookup?search=${value}`,
          description: "IP reputation lookup"
        },
        {
          name: "Shodan",
          url: `https://www.shodan.io/host/${value}`,
          description: "Internet-connected device search"
        },
        {
          name: "IPVoid",
          url: `https://www.ipvoid.com/ip-blacklist-check/?ip=${value}`,
          description: "IP blacklist checker"
        }
      ]
    }

    if (type === "domain") {
      return [
        ...commonLinks,
        {
          name: "AlienVault OTX",
          url: `https://otx.alienvault.com/indicator/domain/${value}`,
          description: "Threat intelligence platform"
        },
        {
          name: "URLScan.io",
          url: `https://urlscan.io/search/#${value}`,
          description: "Website scanner and analysis"
        },
        {
          name: "Cisco Talos",
          url: `https://talosintelligence.com/reputation_center/lookup?search=${value}`,
          description: "Domain reputation lookup"
        },
        {
          name: "MXToolbox",
          url: `https://mxtoolbox.com/SuperTool.aspx?action=a:${value}`,
          description: "DNS and email tools"
        },
        {
          name: "Whois Lookup",
          url: `https://who.is/whois/${value}`,
          description: "Domain registration info"
        }
      ]
    }

    if (type === "url") {
      return [
        ...commonLinks,
        {
          name: "URLScan.io",
          url: `https://urlscan.io/search/#${encodedValue}`,
          description: "Website scanner and analysis"
        },
        {
          name: "URL Void",
          url: `https://www.urlvoid.com/scan/${value.replace(/^https?:\/\//, '')}`,
          description: "URL reputation checker"
        },
        {
          name: "Google Safe Browsing",
          url: `https://transparencyreport.google.com/safe-browsing/search?url=${encodedValue}`,
          description: "Check if URL is on Google's blocklist"
        }
      ]
    }

    if (type === "hash") {
      return [
        ...commonLinks,
        {
          name: "Hybrid Analysis",
          url: `https://www.hybrid-analysis.com/search?query=${value}`,
          description: "Malware analysis sandbox"
        },
        {
          name: "AlienVault OTX",
          url: `https://otx.alienvault.com/indicator/file/${value}`,
          description: "Threat intelligence platform"
        },
        {
          name: "Any.Run",
          url: `https://app.any.run/submissions/#filehash:${value}`,
          description: "Interactive malware sandbox"
        }
      ]
    }

    return commonLinks
  }

  const handleAnalyze = () => {
    const cleanInput = input.trim()
    if (!cleanInput) return

    const type = detectIOCType(cleanInput)
    const links = generateLinks(cleanInput, type)

    setResult({
      value: cleanInput,
      type,
      links
    })
  }

  const generateIncidentNote = () => {
    if (!result) return ""

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19)
    const typeUpper = result.type.toUpperCase()

    return `## IOC Analysis - ${timestamp}

**IOC Type:** ${typeUpper}
**IOC Value:** \`${result.value}\`

### Investigation Steps

1. Checked reputation across multiple threat intelligence sources
2. Reviewed historical activity and associations
3. Assessed risk level based on findings

### Threat Intelligence Sources Checked

${result.links.map(link => `- [${link.name}](${link.url}) - ${link.description}`).join('\n')}

### Findings

- [ ] IOC is malicious
- [ ] IOC is suspicious
- [ ] IOC is clean
- [ ] Further investigation required

### Recommended Actions

- [ ] Block IOC at firewall/gateway
- [ ] Add to blocklist/watchlist
- [ ] Monitor for related activity
- [ ] No action required

### Notes

(Add your investigation notes here)

---
*Generated using IOC Helper Tool - ${new Date().toLocaleDateString()}*`
  }

  const copyIncidentNote = async () => {
    const note = generateIncidentNote()
    await navigator.clipboard.writeText(note)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTypeIcon = (type: IOCType) => {
    switch (type) {
      case "ip":
        return <Shield className="h-5 w-5" />
      case "domain":
        return <Globe className="h-5 w-5" />
      case "url":
        return <ExternalLink className="h-5 w-5" />
      case "hash":
        return <Hash className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: IOCType) => {
    switch (type) {
      case "ip":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "domain":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "url":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "hash":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">IOC Helper Tool</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Quickly analyze IPs, domains, URLs, and file hashes. Get instant links to threat intelligence platforms 
            and generate formatted incident notes for your investigations.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter IOC</CardTitle>
            <CardDescription>
              Paste an IP address, domain, URL, or file hash (MD5/SHA1/SHA256)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: 192.168.1.1 or malicious-domain.com or https://example.com/suspicious or abc123def456..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] font-mono"
            />
            <Button onClick={handleAnalyze} className="gap-2" size="lg">
              <Search className="h-5 w-5" />
              Analyze IOC
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* IOC Type Badge */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Detection Result</CardTitle>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getTypeColor(result.type)}`}>
                    {getTypeIcon(result.type)}
                    <span className="font-semibold uppercase">{result.type}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-mono text-sm break-all">{result.value}</p>
                </div>
              </CardContent>
            </Card>

            {/* Threat Intel Links */}
            {result.type !== "unknown" && (
              <Card>
                <CardHeader>
                  <CardTitle>Check Threat Intelligence Sources</CardTitle>
                  <CardDescription>
                    Click the links below to investigate this IOC across multiple platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {result.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/5 transition-colors group"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{link.name}</div>
                          <div className="text-xs text-muted-foreground">{link.description}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unknown Type Warning */}
            {result.type === "unknown" && (
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-yellow-600 dark:text-yellow-500">Unknown IOC Type</CardTitle>
                  </div>
                  <CardDescription>
                    The input doesn't match expected formats for IP, domain, URL, or hash. Please check your input and try again.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Generated Incident Note */}
            {result.type !== "unknown" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Generated Incident Note
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Copy this markdown-formatted note to your incident documentation
                      </CardDescription>
                    </div>
                    <Button onClick={copyIncidentNote} variant="outline" className="gap-2">
                      {copied ? (
                        <>
                          <CheckCheck className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Note
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto border border-border">
                    {generateIncidentNote()}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Usage Tips */}
        {!result && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Badge variant="outline" className="shrink-0">1</Badge>
                <p>Paste an IOC (IP, domain, URL, or file hash) into the text box above</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="shrink-0">2</Badge>
                <p>Click "Analyze IOC" to detect the type and generate investigation links</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="shrink-0">3</Badge>
                <p>Click the threat intelligence links to check the IOC's reputation</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="shrink-0">4</Badge>
                <p>Copy the generated incident note to document your findings</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
