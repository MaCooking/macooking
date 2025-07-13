<#
.SYNOPSIS
   GitHub repo setup script for Windows
#>

# 1. Initialize Git
if (!(Test-Path ".git")) {
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "⚠ Git already initialized" -ForegroundColor Yellow
}

# 2. Create .gitignore
if (!(Test-Path ".gitignore")) {
@"
# Next.js
.next/
node_modules/

# Environment
.env
.env.local

# Debug
npm-debug.log*

# Production
build
out
"@ | Out-File -FilePath ".gitignore" -Encoding utf8
    Write-Host "✅ .gitignore created" -ForegroundColor Green
}

# 3. Connect to GitHub
$GITHUB_USER = Read-Host "Enter your GitHub username"
$REPO_NAME = Read-Host "Enter repository name"

# 4. Create repo (requires GitHub CLI)
try {
    gh repo create $REPO_NAME --public --confirm
} catch {
    Write-Host "❌ GitHub CLI not installed. Install from: https://cli.github.com/" -ForegroundColor Red
    exit
}

# 5. First commit
git add .
git commit -m "Initial commit: Next.js project setup"

# 6. Push to main
git branch -M main
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
git push -u origin main

Write-Host "🚀 Success! View your repo: https://github.com/$GITHUB_USER/$REPO_NAME" -ForegroundColor Cyan