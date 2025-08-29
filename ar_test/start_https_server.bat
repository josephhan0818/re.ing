@echo off
echo ============================================
echo          AR 應用 HTTPS 服務器
echo         AR App HTTPS Server
echo ============================================
echo.

echo 正在檢查 Python... / Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo 錯誤: 未找到 Python / Error: Python not found
    echo 請安裝 Python: https://python.org
    echo Please install Python: https://python.org
    pause
    exit /b 1
)

echo 正在檢查依賴... / Checking dependencies...
python -c "import cryptography" >nul 2>&1
if errorlevel 1 (
    echo 正在安裝 cryptography... / Installing cryptography...
    pip install cryptography
    if errorlevel 1 (
        echo 安裝失敗，嘗試使用內建方法... / Installation failed, trying built-in method...
    )
)

echo.
echo 正在啟動 HTTPS 服務器... / Starting HTTPS server...
echo.

cd /d "%~dp0"
python https_server.py

pause
