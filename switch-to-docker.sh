#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Switch TaRL Pratham to Docker Deployment
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Switching TaRL Pratham to Docker Deployment                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Backup current Jenkinsfile
if [ -f "Jenkinsfile" ]; then
    echo "📦 Backing up current Jenkinsfile to Jenkinsfile.systemd..."
    mv Jenkinsfile Jenkinsfile.systemd
    echo "✅ Backup created"
else
    echo "⚠️  No existing Jenkinsfile found"
fi

# Switch to Docker Jenkinsfile
if [ -f "Jenkinsfile.docker" ]; then
    echo "🐳 Switching to Docker Jenkinsfile..."
    cp Jenkinsfile.docker Jenkinsfile
    echo "✅ Jenkinsfile.docker copied to Jenkinsfile"
else
    echo "❌ Error: Jenkinsfile.docker not found"
    exit 1
fi

# Stage changes
echo ""
echo "📝 Staging changes for commit..."
git add Jenkinsfile Jenkinsfile.systemd

# Show status
echo ""
echo "Git status:"
git status --short

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Ready to commit and deploy!                                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Review the changes above"
echo "2. Commit: git commit -m 'Switch to Docker deployment'"
echo "3. Push: git push origin main"
echo "4. Jenkins will automatically:"
echo "   - Build Docker image"
echo "   - Deploy container on port 3006"
echo "   - Configure for NPM access"
echo ""
echo "To revert to systemd deployment:"
echo "   mv Jenkinsfile.systemd Jenkinsfile"
echo "   git add Jenkinsfile"
echo "   git commit -m 'Revert to systemd deployment'"
echo "   git push origin main"
echo ""
