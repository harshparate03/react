@echo off
start "Q25_Library_Management Backend" /D "%~dp0server" cmd /k npm.cmd start
cd /d "%~dp0client"
call npm.cmd run dev -- --open
pause
