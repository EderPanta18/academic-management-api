@echo off
REM generate-resumen.bat 

if exist resumen.txt del resumen.txt

for /r src %%f in (*.ts) do (
    echo.>>resumen.txt
    echo ===== %%~nxf =====>>resumen.txt
    type "%%f">>resumen.txt
    echo.>>resumen.txt
    echo.>>resumen.txt
    echo.>>resumen.txt
)

echo _____ resumen.txt generado!
pause
