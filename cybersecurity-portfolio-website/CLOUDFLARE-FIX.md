# Cloudflare Pages Fix for Next.js

## Issue 1: Data Files Not Committed

The `data/` folder files need to be committed to git. Run:

```bash
# Force add the data files (they might be ignored)
git add -f cybersecurity-portfolio-website/data/*.json

# Commit
git commit -m "Add website data files (projects.json, resources.json)"

# Push
git push
```

## Issue 2: Cloudflare Pages Build Command

Cloudflare Pages for Next.js uses a special adapter. Update your Cloudflare Pages settings:

### Build Command:
```
npx @cloudflare/next-on-pages@1
```

### Build Output Directory:
```
.vercel/output/static
```

**OR** if that doesn't work, try:
```
.vercel/output
```

### Root Directory:
```
cybersecurity-portfolio-website
```

### Install Command:
```
pnpm install
```

## Alternative: Use Standard Next.js Build

If the Cloudflare adapter doesn't work, you can try:

**Build Command:**
```
pnpm build && npx @cloudflare/next-on-pages@1
```

**Build Output:**
```
.vercel/output/static
```

## Quick Fix Steps:

1. **Commit the data files:**
   ```bash
   git add -f cybersecurity-portfolio-website/data/*.json
   git commit -m "Add website data files"
   git push
   ```

2. **Update Cloudflare Pages settings:**
   - Build command: `npx @cloudflare/next-on-pages@1`
   - Build output: `.vercel/output/static`
   - Root directory: `cybersecurity-portfolio-website`

3. **Redeploy** - Cloudflare will automatically rebuild
