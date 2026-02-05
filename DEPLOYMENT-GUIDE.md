# Deployment Guide

## Project Structure

```
CyberSecurity-Projects/                    ← GitHub Repo Root
├── Log-Analysis/                          ← Your projects
├── Threat-Intelligence/
├── SOC-Casefiles/
├── Templates/
├── SOC-Notes/
├── cybersecurity-portfolio-website/       ← Next.js Website (inside repo)
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── package.json
│   └── ...
├── README.md                              ← Main portfolio README
└── .gitignore
```

## Two Approaches to Deployment

### Option 1: Deploy Website Separately (Recommended)

**For the GitHub Repo:**
- ✅ Push the **entire project root** to GitHub
- This includes all your projects AND the website folder
- The website folder is just another folder in your repo

**For the Website Deployment:**
- Deploy **only the `cybersecurity-portfolio-website/` folder** to Vercel/Netlify
- This keeps your website deployment separate from your repo structure

**Steps:**
1. Push entire repo to GitHub (as usual)
2. Go to Vercel/Netlify
3. Import project → Select your GitHub repo
4. **Important:** Set the "Root Directory" to `cybersecurity-portfolio-website`
5. Install command: `pnpm install` (runs in the website folder)
6. Build command: `pnpm build` (runs in the website folder)

### Option 2: Deploy Website from Same Repo (Monorepo Style)

**For Everything:**
- Push the entire project root to GitHub
- Configure deployment to build from the website subfolder

**Steps:**
1. Push entire repo to GitHub
2. In Vercel/Netlify, set:
   - Root Directory: `cybersecurity-portfolio-website`
   - Install: `cd cybersecurity-portfolio-website && pnpm install`
   - Build: `cd cybersecurity-portfolio-website && pnpm build`

## Installing Dependencies

**Yes, install pnpm in the website folder:**

```bash
# Navigate to the website folder
cd cybersecurity-portfolio-website

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## What Gets Pushed to GitHub

**Push the entire project root:**
- ✅ All your project folders (Log-Analysis, Threat-Intelligence, etc.)
- ✅ The `cybersecurity-portfolio-website/` folder
- ✅ README.md, .gitignore, etc.

**The website folder is just part of your repo** - it's not a separate repo.

## Recommended Workflow

1. **Local Development:**
   ```bash
   # Work on projects in root
   cd Log-Analysis
   # ... make changes ...
   
   # Work on website
   cd cybersecurity-portfolio-website
   pnpm dev
   ```

2. **Push to GitHub:**
   ```bash
   # From project root
   git add .
   git commit -m "Update portfolio"
   git push
   ```

3. **Deploy Website:**
   - Vercel/Netlify will automatically deploy when you push
   - Make sure "Root Directory" is set to `cybersecurity-portfolio-website`

## Vercel Configuration Example

If deploying to Vercel, create `vercel.json` in the **website folder**:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install"
}
```

Or configure in Vercel dashboard:
- **Root Directory:** `cybersecurity-portfolio-website`
- **Framework Preset:** Next.js
- **Build Command:** `pnpm build` (or leave default)
- **Install Command:** `pnpm install` (or leave default)

## Summary

✅ **Push entire project root** to GitHub (includes website folder)  
✅ **Install pnpm in website folder** (`cd cybersecurity-portfolio-website && pnpm install`)  
✅ **Deploy website folder** separately (set root directory in Vercel/Netlify)

The website is part of your portfolio repo, not a separate repo!
