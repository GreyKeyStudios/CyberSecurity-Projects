# Website Integration Checklist

## Step 1: Extract the Zip File

Extract `cybersecurity-portfolio-website.zip` into a folder. Suggested location:
- Option A: Extract to `website/` folder in the repo root
- Option B: Extract to a separate folder and we'll move files as needed

## Step 2: Review Structure

Once extracted, I'll need to see:
- Project structure (Next.js app router structure)
- Where components are located
- Where pages are located
- Package.json to see dependencies
- Any existing data files

## Step 3: Integration Tasks

### Data Integration
- [ ] Copy `website-data/projects.json` to website's data folder
- [ ] Copy `website-data/resources.json` to website's data folder
- [ ] Update import paths in components/pages

### Content Updates
- [ ] Update homepage with Michael Walton's information
- [ ] Update About page with resume details
- [ ] Verify all project data is displaying correctly
- [ ] Verify badge system is working
- [ ] Verify Resources page shows templates and cheat sheets

### GitHub Links
- [ ] Update GitHub base URL: `https://github.com/GreyKeyStudios/CyberSecurity-Projects`
- [ ] Verify all project links point to correct GitHub paths
- [ ] Test resource links to GitHub markdown files

### Screenshots
- [ ] Verify screenshot paths are correct
- [ ] Test image loading for projects with screenshots
- [ ] Add image optimization if needed

### Configuration
- [ ] Update site metadata (title, description, etc.)
- [ ] Configure for Cloudflare Pages deployment
- [ ] Set up environment variables if needed

## Step 4: Testing

- [ ] Test all pages load correctly
- [ ] Test all links work
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test badge display
- [ ] Test project filtering (if implemented)
- [ ] Verify GitHub links work

## Step 5: Deployment Prep

- [ ] Update build configuration for Cloudflare Pages
- [ ] Test build locally: `npm run build`
- [ ] Verify static export works (if using static export)
- [ ] Check for any build errors

---

**Next Steps:**
1. Extract the zip file
2. Share the extracted folder structure with me
3. I'll integrate the data and make necessary updates
4. Test and deploy
