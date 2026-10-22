@echo off
title EduRisk AI — Dual Full-Stack Launcher
echo ======================================================================
echo Launching EduRisk AI: React + TypeScript Frontend ^& FastAPI Backend
echo ======================================================================
echo.

:: 1. Launch FastAPI Backend in a dedicated window
start "EduRisk AI - FastAPI Backend (Port 8000)" cmd /k "cd /d ""%~dp0"" && py -3.11 -m uvicorn app.main:app --app-dir backend --port 8000 --host 127.0.0.1"

:: 2. Launch Vite React Frontend in a dedicated window
start "EduRisk AI - React Frontend (Port 5173)" cmd /k "cd /d ""%~dp0\frontend"" && npm run dev -- --host 127.0.0.1 --port 5173"

:: 3. Wait briefly and open default browser
timeout /t 3 >nul
start http://localhost:5173

echo ======================================================================
echo Servers active:
echo   React Frontend:   http://localhost:5173
echo   FastAPI Backend:  http://127.0.0.1:8000
echo   API Docs (Swagger): http://127.0.0.1:8000/docs
echo ======================================================================
echo.
pause
