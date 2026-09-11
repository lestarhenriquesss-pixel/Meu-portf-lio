@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js nao encontrado. Instale Node.js 20 ou superior.
 pause
 exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<20)process.exit(1)"
if errorlevel 1 (
 echo Atualize o Node.js para a versao 20 ou superior.
 pause
 exit /b 1
)
set "PORT=4177"
echo Portfolio Lestar v3.2.1 - animacoes continuas.
echo Abra http://127.0.0.1:4177/ e mantenha esta janela aberta.
node scripts/serve.mjs --open
pause
endlocal
