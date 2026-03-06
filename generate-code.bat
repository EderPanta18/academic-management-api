@echo off
set NAME=total_code.txt

if exist %NAME% del %NAME%

for /r src %%f in (*.ts) do (
    echo.>>%NAME%
    echo ===== %%~nxf =====>>%NAME%
    type "%%f">>%NAME%
    echo.>>%NAME%
    echo.>>%NAME%
    echo.>>%NAME%
)

echo _____ %NAME% generado!
pause
