@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Necesitas instalar Node.js 20.9 o posterior para abrir esta web.
  pause
  exit /b 1
)
if not exist "node_modules\next\package.json" (
  echo Instalando las dependencias del proyecto...
  call npm ci
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias. Comprueba tu conexion.
    pause
    exit /b 1
  )
)
echo.
echo Web personal de Ivan Arias
echo Abre http://127.0.0.1:3000 cuando aparezca Ready.
echo Manten esta ventana abierta. Ctrl+C detiene el servidor.
echo.
call npm run dev
if errorlevel 1 pause
