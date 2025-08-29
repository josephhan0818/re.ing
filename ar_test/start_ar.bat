@echo off
title AR App - HTTPS Solution
color 0A

echo.
echo ========================================
echo        AR 應用 HTTPS 解決方案
echo       AR App HTTPS Solution  
echo ========================================
echo.

echo 選擇啟動方式 / Choose startup method:
echo.
echo [1] 使用 ngrok (推薦) / Use ngrok (Recommended)
echo     - 自動提供 HTTPS
echo     - 手機可以直接使用攝像頭
echo     - 需要註冊 ngrok 帳號 (免費)
echo.
echo [2] 本地 HTTP 服務器 / Local HTTP Server  
echo     - 僅限電腦測試
echo     - 手機可能無法使用攝像頭
echo.
echo [3] 手動設置說明 / Manual Setup Instructions
echo.

set /p choice="請輸入選擇 (1-3) / Enter choice (1-3): "

if "%choice%"=="1" goto ngrok
if "%choice%"=="2" goto local
if "%choice%"=="3" goto manual
goto invalid

:ngrok
echo.
echo 正在檢查 ngrok...
where ngrok >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ 未找到 ngrok，請先安裝:
    echo    1. 訪問 https://ngrok.com
    echo    2. 註冊免費帳號
    echo    3. 下載並安裝 ngrok
    echo    4. 運行: ngrok authtoken [你的token]
    echo.
    echo ❌ ngrok not found, please install:
    echo    1. Visit https://ngrok.com
    echo    2. Sign up for free account  
    echo    3. Download and install ngrok
    echo    4. Run: ngrok authtoken [your token]
    echo.
    pause
    goto end
)

echo ✅ 找到 ngrok，正在啟動...
echo.

:: 啟動本地服務器
start "Local Server" cmd /k "cd /d "%~dp0" && python -m http.server 3000"

:: 等待本地服務器啟動
timeout /t 3 >nul

:: 啟動 ngrok
echo 正在創建 HTTPS 隧道...
ngrok http 3000

goto end

:local
echo.
echo 正在啟動本地服務器...
cd /d "%~dp0"
python -m http.server 8000
goto end

:manual
echo.
echo =======================================
echo           手動設置說明
echo        Manual Setup Guide
echo =======================================
echo.
echo 🎯 最佳解決方案 / Best Solution:
echo.
echo 1. 安裝 ngrok / Install ngrok:
echo    - 訪問 / Visit: https://ngrok.com
echo    - 註冊免費帳號 / Sign up for free
echo    - 下載安裝 / Download and install
echo.
echo 2. 設置認證 / Setup authentication:
echo    ngrok authtoken [your_token]
echo.
echo 3. 啟動服務 / Start service:
echo    python -m http.server 3000
echo    ngrok http 3000
echo.
echo 4. 使用 ngrok 提供的 HTTPS 網址
echo    Use the HTTPS URL provided by ngrok
echo.
echo =======================================
echo.
echo 🔧 其他選項 / Other Options:
echo.
echo A. 使用手機 Chrome 的實驗功能:
echo    chrome://flags/#unsafely-treat-insecure-origin-as-secure
echo    添加你的 HTTP 網址
echo.
echo B. 使用 localtunnel:
echo    npm install -g localtunnel
echo    python -m http.server 3000
echo    lt --port 3000
echo.
echo C. 使用 serveo:
echo    python -m http.server 3000  
echo    ssh -R 80:localhost:3000 serveo.net
echo.
echo =======================================
pause
goto end

:invalid
echo 無效選擇，請重新運行 / Invalid choice, please run again
pause
goto end

:end
echo.
echo 程序結束 / Program ended
pause
