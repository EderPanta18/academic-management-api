@echo off
setlocal EnableDelayedExpansion

rem Parametro 1: ruta origen
set "SOURCE=%~1"
if "%SOURCE%"=="" set "SOURCE=src"

rem Parametro 2: nombre archivo salida
set "NAME=%~2"
if "%NAME%"=="" set "NAME=total_code.txt"

rem Si no tiene extension, agregar .txt
for %%A in ("%NAME%") do (
    if "%%~xA"=="" set "NAME=%NAME%.txt"
)

rem Carpeta de salida en la raiz
set "OUTDIR=code"
if not exist "%OUTDIR%" mkdir "%OUTDIR%"

set "OUTPUT=%OUTDIR%\%NAME%"

rem Validar ruta origen
if not exist "%SOURCE%" (
    echo [ERROR] La ruta "%SOURCE%" no existe.
    pause
    exit /b 1
)

rem Eliminar archivo anterior si existe
if exist "%OUTPUT%" del "%OUTPUT%"

rem Recorrer ts y tsx
for /r "%SOURCE%" %%f in (*.ts *.tsx) do (
    echo.>>"%OUTPUT%"
    echo ===== %%~nxf =====>>"%OUTPUT%"
    type "%%f">>"%OUTPUT%"
    echo.>>"%OUTPUT%"
    echo.>>"%OUTPUT%"
    echo.>>"%OUTPUT%"
)

echo.
echo _____ Archivo generado: "%OUTPUT%"
pause
endlocal
