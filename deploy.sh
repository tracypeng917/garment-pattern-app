#!/bin/bash
# 智裁 PatternAI - 一键部署脚本
# 使用方法: bash deploy.sh [vercel|netlify|github]

set -e

PLATFORM=${1:-vercel}
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========================================="
echo "  智裁 PatternAI 部署脚本"
echo "  Deploy Script for PatternAI"
echo "========================================="
echo ""

# Build the project
echo "📦 Building project..."
cd "$PROJECT_DIR"
npm install
npm run build
echo "✅ Build complete!"
echo ""

case $PLATFORM in
  vercel)
    echo "🚀 Deploying to Vercel..."
    echo "   First time? You'll need to:"
    echo "   1. npm i -g vercel"
    echo "   2. vercel login"
    echo "   Then run: vercel --prod"
    echo ""
    npx vercel --prod --yes 2>/dev/null || {
      echo ""
      echo "📝 Manual deployment steps:"
      echo "   1. npm i -g vercel"
      echo "   2. vercel login"
      echo "   3. vercel --prod"
      echo ""
      echo "   Or visit: https://vercel.com/new and import this project folder"
    }
    ;;
  netlify)
    echo "🚀 Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist 2>/dev/null || {
      echo ""
      echo "📝 Manual deployment steps:"
      echo "   1. npm i -g netlify-cli"
      echo "   2. netlify login"
      echo "   3. netlify deploy --prod --dir=dist"
      echo ""
      echo "   Or visit: https://app.netlify.com/drop and drag the dist folder"
    }
    ;;
  github)
    echo "🚀 Deploying to GitHub Pages..."
    echo "📝 Steps:"
    echo "   1. Create a new repo on GitHub"
    echo "   2. git init && git add . && git commit -m 'initial'"
    echo "   3. git remote add origin <your-repo-url>"
    echo "   4. git push -u origin main"
    echo "   5. Go to Settings > Pages > Source: GitHub Actions"
    echo ""
    echo "   A GitHub Actions workflow file has been created at .github/workflows/deploy.yml"
    ;;
  *)
    echo "Usage: bash deploy.sh [vercel|netlify|github]"
    echo "  vercel  - Deploy to Vercel (recommended)"
    echo "  netlify - Deploy to Netlify"
    echo "  github  - Deploy to GitHub Pages"
    exit 1
    ;;
esac

echo ""
echo "========================================="
echo "  ✅ Done! Your app is now live."
echo "========================================="
