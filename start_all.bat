@echo off
echo ==============================================
echo   Starting Avoxell Full Stack Platform
echo ==============================================
start "Avoxell Backend (Django)" cmd /k "cd backend && python manage.py runserver 127.0.0.1:8000"
timeout /t 2 >nul
start "Avoxell Frontend (React)" cmd /k "cd frontend && npm run dev"
echo Both servers are launching!
echo Backend:  http://127.0.0.1:8000/api/v1/
echo Frontend: http://localhost:5173/
pause
