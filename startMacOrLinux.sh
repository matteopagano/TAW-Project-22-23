#!/bin/bash

restore=false
electron=false

for arg in "$@"; do
    case $arg in
        --restore)
            restore=true
            ;;
        --electron)
            electron=true
            ;;
        *)
            ;;
    esac
done

if [ "$restore" = true ]; then
echo "------------ RESTORE ------------"
    docker cp ./DBDump/dump mongodb:/dump 
    docker exec mongodb mongorestore --db MioDB --drop /dump/MioDB
fi

if [ "$electron" = true ]; then
    echo "------------ ELECTRON ------------"
    cd ./ElectronView
    npm install
    npm start
fi

if [ "$restore" = false ] && [ "$electron" = false ]; then
    echo "Any command found!"
fi
