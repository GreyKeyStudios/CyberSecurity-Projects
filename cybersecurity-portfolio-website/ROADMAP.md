# SOC OS – Final Roadmap

Single source of truth for what’s done, what’s next, and what’s optional. Use this before launch and for ongoing backlog.

---

## Phase 1: Pre-Launch Testing (Do First)

Run through systematically; fix issues before deployment.

### Desktop & Windows
- [ ] All desktop apps open, close, minimize, maximize
- [ ] All 9 utility tools open in separate windows (Hash, Base64, Timestamp, Email, IP, Port, User-Agent, Evidence Locker, Timeline)
- [ ] Terminal: `help`, `open <app>`, `check-ip`, `decode`, `ticket`, etc.
- [ ] Settings: toggles, “Clear data”, “Reset OS”
- [ ] About panel: all links work

### Games & Tickets
- [ ] Port Quiz: start, play, scoring, high score persists (localStorage)
- [ ] All 5 mini games: Spot Phishing, Find Malicious IP, Decode Payload, MITRE Bingo, Port Quiz
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

### Site-Wide (from INTEGRATION-COMPLETE)
- [ ] Homepage displays correctly
- [ ] Projects page shows all projects
- [ ] Individual project pages work
- [ ] Casefiles page shows all 5 casefiles
- [ ] Resources page (desktop + all apps) works
- [ ] About page displays correctly
- [ ] Resume page and links work
- [ ] All GitHub links point to correct paths
- [ ] All external links (LinkedIn, email) work

### Content & Copy
- [ ] Update any remaining placeholder text (INTEGRATION-COMPLETE)
- [ ] Resolve “Content not yet available on GitHub” where possible (or document known gaps)

---

## Phase 2: Deployment Readiness

### Build & Env
- [ ] `npm run build` succeeds (from repo root or `cybersecurity-portfolio-website`)
- [ ] Test production locally: `npm run build && npm run start`
- [ ] Environment variables set (Supabase URL + anon key for production)
- [ ] Supabase project is production (not dev)

### Host (e.g. Cloudflare Pages)
- [ ] Build command and output dir correct (see CLOUDFLARE-DEPLOYMENT.md)
- [ ] Root directory: `cybersecurity-portfolio-website`

### Cloudflare Security (if using Cloudflare)
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

## Phase 3: In-App “Coming Soon” / Gaps

Features currently marked Coming Soon or with known gaps.

### Lab Files
- [ ] Add real files for pcap, evtx, eml when ready (3 samples already work: `sample-auth-log.txt`, `sample-events.csv`, `sample-http-access.txt`)
- [ ] Replace “Lab files coming soon” empty state in Lab Files app once more files exist

### Games
- [ ] **Corporate Espionage Simulator** – full game experience (currently placeholder)
- [ ] **MITRE Bingo** – “Game mechanics coming soon” copy; implement or update messaging

### Report Builder
- [ ] Implement or keep “Coming Soon” with clear guidance (Templates + Tickets in meantime)

### Threat Map
- [ ] Implement interactive map (source/target, attack types, time filtering) or remove/repurpose

### Compliance
- [ ] Implement framework checklists (NIST CSF, CIS Controls, control mappings) or remove/repurpose

### Settings
- [ ] **UI sound effects** – “Coming Soon”; implement or remove note
- [ ] **Theme switching** – Settings note says “future updates”; implement or clarify

---

## Phase 4: UX / Polish (Optional)

### Resources Desktop
- [ ] **Narrow viewport:** When side panel (e.g. Cursor chat) is open, desktop scales down and can feel “smushed.” Consider breakpoints or layout tweaks for narrow width so grid stays readable.

### Weird Pics
- [ ] Add real images to `/public/weird-pics/` (1.jpg–6.jpg) to replace placeholders if desired

---

## Phase 5: Mobile (Optional)

- [ ] Responsive breakpoints (e.g. single-window on tablet, card list on mobile)
- [ ] Touch targets and bottom nav for small screens
- [ ] Desktop-first is fine for initial launch

---

## Phase 6: Advanced / Post-Launch (Optional)

- [ ] **Cert Roadmap:** User-editable roadmap (e.g. Supabase persistence)
- [ ] **Terminal:** More commands and integrations
- [ ] **Daily Mission:** Persistence (e.g. Supabase) so progress survives refresh
- [ ] **Performance:** `React.lazy()` for heavy components, compress desktop background, Next.js `Image` where it helps

---

## Phase 7: Docs & Portfolio (Optional)

From DOCUMENTATION-FEATURES.md and INTEGRATION-COMPLETE:

- [ ] Local screenshot storage (e.g. copy to `public/`)
- [ ] README caching in static files
- [ ] Image optimization with Next.js Image component
- [ ] Video support for demos
- [ ] Downloadable project files
- [ ] Add resume PDF to `public/resume.pdf` if using download link

---

## Quick Reference

| Item              | Location / Command        |
|-------------------|----------------------------|
| Build             | `npm run build` (from repo root or `cybersecurity-portfolio-website`) |
| Local prod        | `npm run start`            |
| Lint              | `npm run lint`             |
| Data              | `data/resources.json`, `data/projects.json` |
| VM / Desktop      | `/resources` page         |
| Deployment guide  | `DEPLOYMENT.md`            |
| Cloudflare steps  | `CLOUDFLARE-DEPLOYMENT.md` |

---

**Summary:** Do Phase 1 (testing) and Phase 2 (deployment) before launch. Phase 3 is for closing or clarifying “Coming Soon” and content gaps. Phases 4–7 are optional polish, mobile, advanced features, and docs.
