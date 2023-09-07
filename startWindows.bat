@echo off
REM Verifica se è stato passato un argomento e se l'argomento è '--restore'
IF "%~1"=="--restore" (
    REM Copia il dump nella cartella del container Docker
    docker cp .\DBDump\dump mongodb:/dump 
    REM Esegui il ripristino nel container Docker
    docker exec mongodb mongorestore --db MioDB --drop /dump/MioDB
    
    REM Vai nella cartella "ElectronView"
    cd .\ElectronView
    
    REM Esegui npm install
    npm install
    
    REM Esegui npm start (o il comando specifico per avviare Electron)
    npm start
) ELSE (
    REM Vai nella cartella "ElectronView"
    cd .\ElectronView
    
    REM Esegui npm install
    npm install
    
    REM Esegui npm start (o il comando specifico per avviare Electron)
    npm start
)
