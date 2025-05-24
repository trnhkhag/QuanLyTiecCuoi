@echo off
echo =========================================
echo    QLTC - SSH Private Key Setup
echo =========================================
echo.
echo 1. Go to GitHub Repository Secrets
echo 2. Copy value of PRIVATE_KEY secret
echo 3. Paste into the file that will open
echo 4. Save and close the file
echo.
pause

notepad bizfly-key.pem

echo.
echo Private key saved to: bizfly-key.pem
echo.
echo Now connect with:
echo ssh -i bizfly-key.pem root@103.153.72.156
echo.
pause 