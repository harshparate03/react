@echo off
start "Q11_Product_MongoDB Backend" /D "%~dp0server" cmd /k npm.cmd start
cd /d "%~dp0client"
call npm.cmd run dev -- --open
pause
