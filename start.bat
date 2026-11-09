@echo off
TITLE GanimiRank Launcher
COLOR 0A

echo ==============================================================================
echo                 GANIMIRANK: GUERRILLA SEARCH INTELLIGENCE
echo                Autonomous SERP & AEO/GEO Dominance Console
echo ==============================================================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3.10+ is required but not found in PATH.
    pause
    exit /b 1
)

:: Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js 18+ is required but not found in PATH.
    pause
    exit /b 1
)

echo [1/3] Starting GanimiRank FastAPI Backend on http://127.0.0.1:8000 ...
cd backend
start "GanimiRank Backend Core (:8000)" cmd /k ".\venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
cd ..

echo [2/3] Starting GanimiRank Next.js Frontend Console on http://localhost:3000 ...
cd frontend
start "GanimiRank Frontend Console (:3000)" cmd /k "npm run dev"
cd ..

echo [3/3] Launching GanimiRank Dashboard in your default browser...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo ==============================================================================
echo [SUCCESS] GanimiRank is running!
echo - Frontend: http://localhost:3000
echo - Backend:  http://127.0.0.1:8000
echo - API Docs: http://127.0.0.1:8000/docs
echo ==============================================================================
echo.
echo Keep this terminal open or close it safely. Services are running in separate windows.
pause
