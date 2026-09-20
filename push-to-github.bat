@echo off
setlocal
echo ===================================================
echo   Deploying Portfolio to GitHub Pages
echo ===================================================
echo.
echo Make sure you have created the public repository:
echo   https://github.com/new with name: kashishhshukla.github.io
echo.

set /p TOKEN="Enter your GitHub Personal Access Token (PAT): "

if "%TOKEN%"=="" (
    echo [ERROR] Token cannot be empty.
    pause
    exit /b 1
)

echo.
echo Pushing to https://github.com/KashishhShukla/kashishhshukla.github.io.git ...
"C:\Users\Kashish\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe" push https://KashishhShukla:%TOKEN%@github.com/KashishhShukla/kashishhshukla.github.io.git main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo   SUCCESS! Your portfolio is deployed to GitHub!
    echo   Live site: https://kashishhshukla.github.io/
    echo ===================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check your token permissions (needs 'repo' scope).
)

pause
