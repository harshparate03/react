@echo off
cd /d "%~dp0"
echo API available at http://localhost:3000 - use Postman to test.
call npm.cmd start
pause
