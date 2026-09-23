@echo off
cd /d "%~dp0"
title BhashaSetu - Hindi to Santhali/Mundari AI Companion
echo ================================================================
echo               BhashaSetu Classroom Companion
echo ================================================================
echo.
echo [1/3] Checking Python dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 (
    py -3.13 -m pip install -r requirements.txt
)

echo.
echo [2/3] Opening browser at http://127.0.0.1:8000 ...
timeout /t 3 /nobreak >nul
start http://127.0.0.1:8000

echo [3/3] Launching mT5 Model and Server...
python server.py
if errorlevel 1 (
    py -3.13 server.py
)
pause
