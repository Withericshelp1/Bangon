@echo off
REM Windows Quick Start for Melville Ceilings Spacing Audit
REM Output: Google Sheets in your Drive folder

setlocal enabledelayedexpansion

set NODE=C:\nodejs\node.exe
set NPM=C:\nodejs\npm.cmd

cd /d "%~dp0"

echo.
echo ========================================
echo MELVILLE CEILINGS SPACING AUDIT
echo Output: Google Sheets
echo ========================================
echo.

REM Check Node.js
if not exist "%NODE%" (
    echo ✗ Node.js not found at %NODE%
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js found

REM Install dependencies
echo.
echo Installing dependencies...
"%NODE%" -e "const fs = require('fs'); if (!fs.existsSync('node_modules')) process.exit(1)" 2>nul
if errorlevel 1 (
    echo Running: npm install
    "%NPM%" install
    if errorlevel 1 (
        echo ✗ npm install failed
        pause
        exit /b 1
    )
)

echo ✓ Dependencies ready

REM Run full audit
echo.
echo ======================================
echo Starting spacing audit...
echo (This will take 15-20 minutes)
echo ======================================
echo.

"%NODE%" run-full-audit.mjs

if errorlevel 1 (
    echo.
    echo ✗ Audit failed
    pause
    exit /b 1
)

echo.
echo ======================================
echo ✓ AUDIT COMPLETE
echo ======================================
echo.
echo Your Google Sheet is ready at:
echo https://drive.google.com/drive/folders/1YMo7P-8CMOYX0WluwwHRC1lHxKHEmTdR
echo.
pause
