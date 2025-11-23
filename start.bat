@echo off
echo ========================================
echo Car Rental System - Quick Start
echo ========================================
echo.

echo Step 1: Installing Python dependencies...
cd backend
pip install -r requirements.txt
echo.

echo Step 2: Initializing database...
cd ..\database
python init_db.py
echo.

echo Step 3: Starting backend server...
cd ..\backend
echo Backend will start on http://localhost:5000
echo.
echo To access the website:
echo 1. Open frontend\index.html in your browser
echo 2. Or navigate to http://localhost:5000 (backend serves frontend)
echo.
echo Default Admin Credentials:
echo Username: admin
echo Password: admin123
echo.
echo Starting server...
python app.py
