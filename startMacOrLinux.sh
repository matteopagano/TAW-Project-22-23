#!/bin/bash


# Verifica se è stato passato un argomento e se l'argomento è '--restore'
if [ $# -eq 1 ] && [ "$1" = "--restore" ]; then

    docker cp ./DBDump/dump mongodb:/dump 
    docker exec mongodb mongorestore --db MioDB --drop /dump/MioDB


    # Vai nella cartella "ElectronView"
    cd ./ElectronView

    # Esegui npm install
    npm install

    # Esegui npm start (o il comando specifico per avviare Electron)
    npm start

    
    # Chiamare qui la tua funzione di ripristino
else

    # Vai nella cartella "ElectronView"
    cd ./ElectronView

    # Esegui npm install
    npm install

    # Esegui npm start (o il comando specifico per avviare Electron)
    npm start
  
fi

