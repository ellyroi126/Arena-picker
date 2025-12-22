@echo off
echo ========================================
echo Restaurant Arena Picker - Windows Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Or simply double-click: start-dev.bat
echo.
pause
