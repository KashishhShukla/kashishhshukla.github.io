param(
    [string]$Token
)

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Deploying Portfolio to GitHub Pages" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure you have created the public repository at:" -ForegroundColor Yellow
Write-Host "  https://github.com/new" -ForegroundColor Yellow
Write-Host "  Name: kashishhshukla.github.io" -ForegroundColor Yellow
Write-Host ""

if (-not $Token) {
    $Token = Read-Host "Enter your GitHub Personal Access Token (PAT)"
}

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Error "Token cannot be empty."
    exit 1
}

$git = "C:\Users\Kashish\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe"
$repoUrl = "https://KashishhShukla:$Token@github.com/KashishhShukla/kashishhshukla.github.io.git"

Write-Host "Pushing branch 'main' to GitHub..." -ForegroundColor Green
& $git push $repoUrl main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Deployed to GitHub Pages!" -ForegroundColor Green
    Write-Host "  Live URL: https://kashishhshukla.github.io/" -ForegroundColor Green
    Write-Host "===================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ERROR] Push failed. Make sure:" -ForegroundColor Red
    Write-Host "1. You created the repository 'kashishhshukla.github.io' on GitHub." -ForegroundColor Red
    Write-Host "2. Your token has the 'repo' permission checked." -ForegroundColor Red
}
