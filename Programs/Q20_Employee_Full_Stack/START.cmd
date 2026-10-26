@echo off
start "Q20_Employee_Full_Stack Backend" /D "%~dp0server" cmd /k npm.cmd start
cd /d "%~dp0client"
call npm.cmd run dev -- --open
pause
