# Deployment Guide for Pennysavia USA

This guide will help you deploy the frontend to Netlify or Vercel without any stress.

## Prerequisites

- GitHub account (recommended) or Git repository
- Netlify account (free) OR Vercel account (free)
- Node.js 18+ installed locally (for testing)

## Quick Deploy to Netlify

### Option 1: Deploy via Netlify UI (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository

3. **Configure Build Settings**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
   - Click "Deploy site"

4. **Done!** Your site will be live in ~2 minutes

### Option 2: Deploy via Netlify CLI

```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel UI (Easiest)

1. **Push your code to GitHub** (same as above)

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Click "Deploy"

4. **Done!** Your site will be live in ~1 minute

### Option 2: Deploy via Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

## Important Notes

### ✅ What's Already Configured

- ✅ SPA routing (all routes redirect to index.html)
- ✅ Build configuration in `netlify.toml` and `vercel.json`
- ✅ Mobile responsive design
- ✅ Static assets properly referenced
- ✅ No backend dependencies (works as static site)

### 📁 File Structure

```
frontend/
├── src/              # React source code
├── public/           # Static assets (images, etc.)
│   └── images/       # Your landing page images
├── dist/             # Build output (generated)
├── package.json      # Dependencies
├── vite.config.js    # Vite configuration
├── netlify.toml      # Netlify config
└── vercel.json       # Vercel config
```

### 🖼️ Adding Images

If you want to add images with white men/women and USA backgrounds:

1. Place images in `frontend/public/images/`
2. Update image paths in `src/pages/LandingPage.jsx`:
   ```jsx
   const heroImages = [
     '/images/your-image-1.jpg',
     '/images/your-image-2.jpg',
     // ... etc
   ]
   ```
3. Images will be automatically included in the build

### 🔧 Environment Variables (Optional)

If you need to connect to a backend API:

**Netlify:**
- Go to Site Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend-url.com`

**Vercel:**
- Go to Project Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend-url.com`

### 🐛 Troubleshooting

**Build fails?**
- Make sure you're in the `frontend` directory
- Run `npm install` first
- Check Node.js version (needs 18+)

**Routes not working?**
- Make sure `netlify.toml` or `vercel.json` has the SPA redirect rule
- Clear browser cache

**Images not showing?**
- Check image paths start with `/images/` (not `./images/`)
- Images must be in `public/images/` folder
- Rebuild after adding images

### 📱 Testing Locally

Before deploying, test locally:

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

Then build and test production build:

```bash
npm run build
npm run preview
# Open http://localhost:4173
```

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Netlify/Vercel build logs
3. Verify all file paths are correct
4. Ensure Node.js version is 18+

---

**Ready to deploy! 🚀**
