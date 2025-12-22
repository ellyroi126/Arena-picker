# Windows Setup Guide

## Local Development

### 1. Install Node.js
- Download from https://nodejs.org/ (LTS version recommended)
- Run installer and follow prompts
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Clone or Download the Project
- If using Git:
  ```bash
  git clone <your-repo-url>
  cd restaurantArenaPicker
  ```
- Or download as ZIP and extract

### 3. Install Dependencies
Open PowerShell or Command Prompt in the project folder:
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Build for Production (Optional)
```bash
npm run build
```
This creates a `dist` folder with optimized files.

## Troubleshooting Windows

### Issue: "npm not recognized"
- Restart your terminal/computer after installing Node.js
- Add Node.js to PATH manually if needed

### Issue: Permission errors
- Run PowerShell/CMD as Administrator
- Or use: `npm install --legacy-peer-deps`

### Issue: Port 5173 already in use
- Change port in `vite.config.js` or kill the process using the port

---

## Free Hosting Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (optional, or use website)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   vercel
   ```
   Follow the prompts, and it will deploy automatically.

3. **Or Deploy via Website**
   - Go to https://vercel.com
   - Sign up with GitHub/GitLab/Bitbucket
   - Click "New Project"
   - Import your Git repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"
   - Done! Get a live URL like `your-app.vercel.app`

**Pros:**
- Zero configuration for Vite projects
- Automatic HTTPS
- Free custom domains
- Instant deployments on git push

---

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

3. **Or Deploy via Website**
   - Go to https://www.netlify.com
   - Sign up and click "Add new site"
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy"

**Pros:**
- Easy drag-and-drop deployment
- Form handling
- Free SSL

---

### Option 3: GitHub Pages

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `vite.config.js`**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/restaurantArenaPicker/', // Replace with your repo name
   })
   ```

3. **Add to `package.json` scripts**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to your GitHub repo → Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` → `/root`
   - Save

Your site will be at: `https://your-username.github.io/restaurantArenaPicker/`

**Pros:**
- Free with GitHub account
- Version controlled

---

### Option 4: Cloudflare Pages

1. **Go to https://pages.cloudflare.com**
2. Sign up and connect your Git repository
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Click "Save and Deploy"

**Pros:**
- Fast global CDN
- Unlimited bandwidth
- Free SSL

---

## Recommended: Vercel

For this project, **Vercel** is the easiest option:

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repo
4. Click Deploy (Vercel auto-configures everything)
5. Share your live URL!

**Free tier includes:**
- Unlimited personal projects
- Automatic HTTPS
- Global CDN
- Preview deployments for every git push
