@echo off
title SkillForge — Web + Ollama AI
cd /d "%~dp0web EN"

echo === Khoi dong Ollama AI (qwen2.5:7b) ===
start /b "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve >nul 2>&1

echo === Dong mo trinh duyet ===
timeout /t 3 /nobreak >nul
start "" "http://localhost:8080"

echo === Chay Web Server ===
echo Nhan Ctrl+C de dung server.
echo.
node server.js

pause
