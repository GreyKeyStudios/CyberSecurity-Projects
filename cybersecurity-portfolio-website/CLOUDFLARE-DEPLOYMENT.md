# Cloudflare Pages Deployment Guide

## Static Export (No Workers)

This site is built as a **fully static export** (`output: 'export'`). Content is copied into `public/content/` at build time; there are **no API routes** and **no Cloudflare Workers**. This avoids Worker bundle size limits and keeps deployment simple.

- **Cloudflare Pages** = Serves the static `out/` folder (what you use)
- **Cloudflare Workers** = Not used; no serverless functions

---

## Step-by-Step Deployment

### Step 1: Go to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **"Workers & Pages"** in the sidebar
3. Click **"Create application"**
4. Click **"Pages"** tab
5. Click **"Connect to Git"**

### Step 2: Connect GitHub Repository

1. **Authorize Cloudflare** to access your GitHub (if not already done)
2. **Select repository:** `GreyKeyStudios/CyberSecurity-Projects`
3. Click **"Begin setup"**

### Step 3: Configure Build Settings

**Project name:** `cybersecurity-portfolio` (or any name you like)

**Production branch:** `main` (or `master` if that's your default branch)

**Build settings:**

**Framework preset:** `Next.js` (Cloudflare should auto-detect this)

**Build command:**
```bash
cd cybersecurity-portfolio-website && pnpm build
```
(This runs `prebuild` first, which copies repo content into `public/content/`, then `next build` produces a static export.)

**Build output directory:**
```
out
```
(The app uses Next.js static export; the output is in the `out` folder, not `.next`.)

**Root directory (IMPORTANT!):**
```
cybersecurity-portfolio-website
```

**Environment variables:** (None needed for now, unless you add API keys later)

### Step 4: Advanced Settings (Optional but Recommended)

Click **"Show advanced settings"** and set:

**Node version:** `20` or `22` (latest LTS)

**Install command:**
```bash
cd cybersecurity-portfolio-website && pnpm install
```

### Step 5: Deploy!

1. Click **"Save and Deploy"**
2. Cloudflare will:
   - Install dependencies
   - Build your Next.js site
   - Deploy it
3. Wait 2-5 minutes for the build to complete

### Step 6: Custom Domain (Optional)

After deployment:
1. Go to your Pages project
2. Click **"Custom domains"**
3. Add your domain (e.g., `portfolio.greykeystudios.dev`)
4. Cloudflare will automatically configure DNS

---

## Build Configuration Summary

```
Framework preset: Next.js
Root directory: cybersecurity-portfolio-website
Build command: cd cybersecurity-portfolio-website && pnpm build
Build output directory: cybersecurity-portfolio-website/.next
Node version: 20
Install command: cd cybersecurity-portfolio-website && pnpm install
```

---

## Worker size limit (if using @cloudflare/next-on-pages)

If your Cloudflare Pages build uses **`npx @cloudflare/next-on-pages@1`**, the app is compiled into a **single Cloudflare Worker**. The free plan limits that Worker to **3 MiB**; the paid plan allows **10 MiB**. This Next.js app is large (resources page, many routes), so the bundle can exceed both limits and deployment fails with:

```text
Error: Failed to publish your Function. Got error: Your Worker exceeded the size limit of 3 MiB.
```

**Options:**

1. **Deploy to Vercel or Netlify (simplest)**  
   Use standard Next.js deployment (no Worker bundle). Connect the same repo, set root to `cybersecurity-portfolio-website`, build command `pnpm run build` (or `npm run build`). No size limit for the app bundle.

2. **Switch to OpenNext for Cloudflare**  
   Use [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) instead of `@cloudflare/next-on-pages`. It’s the current recommended adapter, can produce smaller/split bundles, and uses the Node-compat runtime (no Edge-only). You would:
   - Remove `export const runtime = 'edge'` from `app/layout.tsx`, `app/api/resource-content/route.ts`, and `app/not-found.tsx`.
   - Follow [OpenNext Cloudflare Get Started](https://opennext.js.org/cloudflare/get-started) (install `@opennextjs/cloudflare`, wrangler, wrangler config, update build/deploy scripts).
   - If the single-Worker bundle is still over 10 MiB on paid, use [Multi-Worker](https://opennext.js.org/cloudflare/howtos/multi-worker) to split the app across Workers.

3. **Upgrade to Cloudflare Workers Paid**  
   Only helps if the **compressed** bundle is under 10 MiB. This app may still exceed that; check the build output for the reported Worker size after switching to OpenNext.

---

## Troubleshooting

### Build Fails: "Cannot find module"

**Problem:** Dependencies not installing correctly

**Solution:** Make sure the install command includes the directory:
```bash
cd cybersecurity-portfolio-website && pnpm install
```

### Build Fails: "Command not found: pnpm"

**Problem:** pnpm not available in Cloudflare's build environment

**Solution:** Use npm instead:
```bash
# Install command:
cd cybersecurity-portfolio-website && npm install

# Build command:
cd cybersecurity-portfolio-website && npm run build
```

### Build Succeeds but Site Shows 404

**Problem:** Build output directory might be wrong

**Solution:** Check that output directory is:
```
cybersecurity-portfolio-website/.next
```

### Images/Screenshots Not Loading

**Problem:** GitHub raw URLs might be blocked or slow

**Solution:** 
- This should work once the repo is public
- If issues persist, we can copy images to the `public/` folder

### Content Not Loading (Resources/Projects)

**Problem:** GitHub raw URLs not accessible during build

**Solution:**
- Make sure the repo is **public**
- The fetch happens at build time, so the repo must be accessible
- Check the build logs for fetch errors

---

## Alternative: Use npm Instead of pnpm

If pnpm causes issues, you can use npm:

**Install command:**
```bash
cd cybersecurity-portfolio-website && npm install
```

**Build command:**
```bash
cd cybersecurity-portfolio-website && npm run build
```

---

## After Deployment

1. **Check the build logs** for any errors
2. **Visit your site** at the provided `.pages.dev` URL
3. **Test all pages:**
   - Homepage
   - Projects
   - Individual project pages
   - Resources
   - Resource detail pages
   - About page

---

## Continuous Deployment

Once connected, Cloudflare Pages will:
- ✅ Automatically deploy on every push to `main`
- ✅ Create preview deployments for pull requests
- ✅ Show build status in GitHub

---

## Quick Reference

**Repository:** `GreyKeyStudios/CyberSecurity-Projects`  
**Root Directory:** `cybersecurity-portfolio-website`  
**Framework:** Next.js  
**Build Tool:** pnpm (or npm)  
**Output:** `.next` folder

---

## Need Help?

If the build fails:
1. Check the build logs in Cloudflare dashboard
2. Look for error messages
3. Common issues:
   - Wrong root directory
   - Missing dependencies
   - Build command errors
   - Node version mismatch
