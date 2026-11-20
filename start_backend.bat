@echo off
echo ==============================================
echo   Starting Avoxell Django REST API Backend
echo ==============================================
cd backend
python manage.py runserver 127.0.0.1:8000
pause
