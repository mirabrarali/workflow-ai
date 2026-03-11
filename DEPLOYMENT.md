# WorkflowAI - Deployment Guide

## 🚀 Quick Deployment to Vercel

### Step 1: Prepare Your Code

1. Make sure your code is in a Git repository:
```bash
git init
git add .
git commit -m "Initial commit: WorkflowAI POC"
```

2. Push to GitHub (or GitLab/Bitbucket):
```bash
git remote add origin https://github.com/yourusername/workflow-poc.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

Follow the prompts and Vercel will guide you through deployment.

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration
5. Click "Deploy"

### Step 3: Configure Environment Variables

1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add the following variable:
   - **Key**: `NEXT_PUBLIC_GROQ_API_KEY`
   - **Value**: Your GROQ API key from https://console.groq.com
   - **Environments**: Production, Preview, Development (select all)

3. Click "Save" and redeploy:
   ```bash
   vercel --prod
   ```

### Step 4: Verify Deployment

1. Go to your Vercel deployment URL
2. The app should load without errors
3. Try uploading a test PDF
4. Use the workflow builder to create a test workflow

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use strong API keys** - Get from GROQ dashboard
3. **Set environment variables in Vercel**, not in code
4. **Monitor API usage** - Check GROQ dashboard for quota
5. **Test before production** - Use preview deployments

## 📊 Monitoring

View logs and metrics in Vercel:
```bash
vercel logs
```

## 🛠️ Troubleshooting

### "GROQ API key not found"
- Check that environment variable is set in Vercel
- Verify the key is correct in GROQ console
- Redeploy after adding environment variables

### "PDF processing timeout"
- Reduce PDF file size (max 10MB)
- Check Vercel function duration (set to 60s)
- Increase function memory if needed

### "Chat API errors"
- Verify GROQ API key is active
- Check API rate limits in GROQ dashboard
- Review error logs in Vercel

## 📈 Performance Optimization

1. **Enable caching** in `next.config.ts`
2. **Optimize images** in public folder
3. **Use CDN** for static assets (Vercel handles this)
4. **Monitor function duration** in Vercel Analytics

## 🔄 Continuous Deployment

The app automatically deploys on every push to main:
1. Push code to GitHub
2. Vercel automatically builds and deploys
3. View build logs in Vercel dashboard

## 💾 Backup & Recovery

Since we use localStorage by default:
1. User workflows are stored in browser
2. Export workflows via API (future feature)
3. For production, migrate to database (Supabase, Firebase)

## 🎯 Next Steps After Deployment

1. Add custom domain (Vercel settings)
2. Setup analytics (Vercel Analytics)
3. Enable database (Supabase/Firebase)
4. Implement user authentication
5. Add webhook integrations
6. Setup monitoring and alerts

---

For more help:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GROQ Documentation: https://console.groq.com/docs
