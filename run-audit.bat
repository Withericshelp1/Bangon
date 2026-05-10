@echo off
setlocal enabledelayedexpansion

REM Set Node.js path
set NODE_PATH=C:\nodejs\node.exe
set NPM_PATH=C:\nodejs\npm.cmd

REM Change to project directory
cd /d "C:\Users\e_ibe\OneDrive\Documents\WEH\CLAUDE CODE\Claude site test"

echo =====================================================
echo MELVILLE CEILINGS SPACING AUDIT - FULL
echo =====================================================
echo.
echo Starting audit of 36 pages at 2 viewport sizes...
echo Estimated time: 15-20 minutes
echo.

REM Run the audit
"%NODE_PATH%" spacing-audit-logged.mjs

if errorlevel 1 (
    echo.
    echo ✗ Audit failed with error code %errorlevel%
    pause
    exit /b %errorlevel%
)

echo.
echo =====================================================
echo ✓ Audit complete!
echo =====================================================
echo.
echo Next step: Generate Excel report
echo Run: %NPM_PATH% exec node generate-excel.mjs
echo.
pause
