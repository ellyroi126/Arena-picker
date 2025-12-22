# Deployment Instructions

## Quick Deploy to Vercel (Easiest - 2 minutes)

### Method 1: Via Website (No installation needed)
1. Push your code to GitHub
2. Go to https://vercel.com and sign up
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy" (Vercel auto-detects everything)
6. Done! You'll get a URL like `your-app.vercel.app`

### Method 2: Via CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy (run this in project folder)
vercel

# Follow the prompts
# First time: Link to existing project or create new
# Subsequent deploys: Just run 'vercel' again
```

**Benefits:**
- ✅ Free forever for personal projects
- ✅ Automatic HTTPS
- ✅ Global CDN (fast worldwide)
- ✅ Auto-deploy on git push
- ✅ Zero configuration needed

---

## Deploy to Netlify

### Via Website
1. Build the project: `npm run build`
2. Go to https://www.netlify.com
3. Drag the `dist` folder to Netlify's drop zone
4. Done!

### Via CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Follow prompts
# Publish directory: dist
```

---

## Deploy to GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/restaurantArenaPicker/', // Your repo name
})
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add to `package.json` scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages in repo settings:
   - Settings → Pages
   - Source: `gh-pages` branch
   - Save

Your site: `https://your-username.github.io/restaurantArenaPicker/`

---

## Deploy to Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Connect your Git repository
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click "Deploy"

---

## Recommended for Beginners: Vercel

**Why Vercel?**
- Fastest to set up (literally 1 minute)
- No configuration needed
- Free SSL certificate
- Automatic deployments
- Perfect for React/Vite projects
- Free custom domains

**Quick Start:**
```bash
npm install -g vercel
vercel login
vercel
```

That's it! 🎉
