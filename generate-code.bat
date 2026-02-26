@echo off
set REPORT_NAME=total_code.txt

if exist %REPORT_NAME% del %REPORT_NAME%

for /r src %%f in (*.ts) do (
    echo.>>%REPORT_NAME%
    echo ===== %%~nxf =====>>%REPORT_NAME%
    type "%%f">>%REPORT_NAME%
    echo.>>%REPORT_NAME%
    echo.>>%REPORT_NAME%
    echo.>>%REPORT_NAME%
)

echo _____ %REPORT_NAME% generado!
pause
