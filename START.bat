@echo off
echo Starting Cross-Language Semantic Search Engine...
echo.
echo Please make sure you have added your OpenAI API key to backend\.env
echo.
echo Starting backend server...
start cmd /k "cd backend && npm run dev"
echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul
echo.
echo Starting frontend...
start cmd /k "cd frontend && npm start"
echo.
echo Backend will run on http://localhost:5000
echo Frontend will open on http://localhost:3000
echo.
