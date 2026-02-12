# SOC OS – Test, Refinement & Deployment

Deployment pipeline is already set (e.g. Cloudflare Pages / Vercel). This doc covers final testing, refinement, and security configuration before going live with the enhanced version.

---

## Phase 1: Testing & Bug Fixes (Do First)

Run through these systematically and fix any issues before deployment.

### Desktop & Windows
- [ ] All desktop apps open, close, minimize, maximize
- [ ] All 9 utility tools open in separate windows (Hash, Base64, Timestamp, Email, IP, Port, User-Agent, Evidence Locker, Timeline)
- [ ] Terminal: `help`, `open <app>`, `check-ip`, `decode`, `ticket`, etc.
- [ ] Settings: toggles, “Clear data”, “Reset OS”
- [ ] About panel: all links work

### Games & Tickets
- [ ] Port Quiz: start, play, scoring, high score persists (localStorage)
- [ ] All 5 mini games: Spot Phishing, Find Malicious IP, Decode Payload, MITRE Bingo (plus Port Quiz)
- [ ] All 10 incident tickets: read scenario, guided mode, expert mode, hints, solution

### Content & Auth
- [ ] SOC Journal: create, read, update, delete, search, filter
- [ ] Auth: sign in, sign out, guest mode, “Exit OS” (guest = lose work; signed-in = restore session)
- [ ] Start Here wizard: navigation and suggested apps
- [ ] Daily Mission: task suggestions and app launching
- [ ] All content apps: Case Files, Playbooks, Templates, Quick Reference, CLI Cheats, Glossary, Log Viewer, Projects, Sec+ Vault, Skill Drills, etc.
- [ ] In-window navigation: back/forward where applicable
- [ ] Search/filter in apps that have it (Glossary, CLI, etc.)
- [ ] External links: GitHub, resume, threat intel links open correctly

---

## Phase 2: Content (Done)

- **Tickets:** 10 incident tickets (including Privilege Escalation, SQLi, DDoS, PowerShell, Shadow IT)
- **Sec+ Vault:** Study plan, 2-week plan, 6 cheat sheets (ports, acronyms, CIA/controls, authn/authz, attacks, encryption), resources + Quizlet
- **Skill Drills:** 32 questions across Event IDs, Ports, MITRE, Log Analysis, IOC ID, Splunk & Threat Hunting
- **Lab Files:** 3 sample files available for download: `sample-auth-log.txt`, `sample-events.csv`, `sample-http-access.txt` in `/public/lab-files/`. Download button works when `available: true` and `path` is set. Remaining entries (pcap, evtx, eml) stay as “Coming soon” until you add real files.

---

## Phase 3: Mini Games (Done)

- Port Quiz, Spot the Phishing, Find the Malicious IP, Decode the Payload, MITRE Bingo – all implemented.

---

## Phase 4: Performance (Done)

- **Debounce (300 ms):** Search in CLI Cheats, SOC Dictionary (Glossary), SOC Journal.
- **useMemo:** Filtered lists in CLI Cheats, Glossary, Threat Feed, Lab Files, SOC Journal (filtered entries). `selectedFile` in Lab Files memoized.
- Run `npm run build` — should pass. Optional later: `React.lazy()` for heavy components (would require splitting into separate files), compress desktop background, Next.js `Image`.

---

## Phase 5: Mobile (Optional – 1 of 2 things left)

- Desktop-first is fine for initial launch.
- When you want it: responsive breakpoints (e.g. single-window on tablet, card list on mobile), touch targets, bottom nav.

---

## Phase 6: Advanced Features (Optional – 2 of 2 things left)

- Enhanced Cert Roadmap (user-editable, Supabase), enhanced Terminal commands, Daily Mission persistence – can be post-launch.

---

## Phase 7: Deployment

### Pre-Deploy
- [ ] `npm run build` succeeds
- [ ] Test production build locally: `npm run build && npm run start`
- [ ] Environment variables set (e.g. Supabase URL + anon key for production)
- [ ] Supabase project is production (not just dev)

### Pipeline (Already Set)
- Build command: `npm run build`
- Build output: `.next` (or per your host: e.g. `out` if using static export)
- Connect repo; deploy on push to main (or your chosen branch)

### Cloudflare Security (When Using Cloudflare)
- [ ] WAF: OWASP + Cloudflare Managed Ruleset
- [ ] Bot Fight Mode (or equivalent)
- [ ] SSL/TLS: Full (strict)
- [ ] Always Use HTTPS
- [ ] HSTS enabled
- [ ] Auto Minify (CSS, JS, HTML)
- [ ] Brotli compression
- [ ] Security level: Medium or High

### Supabase Production
- [ ] Email verification enabled (if using email auth)
- [ ] RLS policies reviewed
- [ ] Backups configured
- [ ] Rate limiting / abuse protection
- [ ] Session timeout set

### Post-Deploy
- [ ] Full smoke test on production URL
- [ ] Auth flow (sign in, sign out, guest)
- [ ] Check security headers (e.g. securityheaders.com)
- [ ] SSL check (e.g. ssllabs.com) if custom domain
- [ ] Verify external links and key app flows

---

## Quick Reference

| Item              | Location / Command        |
|-------------------|----------------------------|
| Build             | `npm run build`             |
| Local prod        | `npm run start`             |
| Lint              | `npm run lint`             |
| Data              | `data/resources.json`, `data/projects.json` |
| VM / Desktop      | `/resources` page          |

Once Phase 1 testing is done and Phase 7 security is configured (Cloudflare + Supabase), you’re ready to ship the enhanced SOC OS.
