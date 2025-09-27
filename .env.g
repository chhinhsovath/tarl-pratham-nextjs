echo "# tarl-pratham-nextjs" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/chhinhsovath/tarl-pratham-nextjs.git
git push -u origin main



giសដសthub_pសដសដសដសដសat_11BL4DDZY0សដm53សដសដIvxBIvij8_7yBWuJMQtCkL3AEh7សដc0zP9v1KសដសដfptbRL8PVnសសដសដដOoqCAfzCLSUPសដRCWPIx8Ptivs


  DATABASE_URL=postgresql://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?schema=public
  NEXTAUTH_URL=https://tarl.openplp.com
  NEXTAUTH_SECRET=5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=
  NODE_ENV=production
  NEXT_PUBLIC_API_URL=tarl.openplp.com
  UPLOAD_DIR=/tmp/uploads
  MAX_FILE_SIZE=5242880
  SESSION_TIMEOUT=86400000


  1. Connect your GitHub repository to Vercel:
    - Go to https://vercel.com
    - Click "New Project"
    - Import your GitHub repository: chhinhsovath/tarl-pratham-nextjs
    - Configure the project settings:
        - Framework Preset: Next.js
      - Root Directory: ./
      - Build Command: npm run build
      - Output Directory: .next
      - Install Command: npm install
  2. Add Environment Variables in Vercel:
  You need to add your environment variables from .env.local:
  DATABASE_URL=postgresql://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?schema=public
  NEXTAUTH_URL=https://your-vercel-domain.vercel.app
  NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
  3. Deploy:
    - Click "Deploy"
    - Vercel will automatically deploy your app

    
  i like you to check all features and functions of homepage from this laravel homepage /Users/chhinhsovath/Documents/GitHub/tarlprathom_laravel.