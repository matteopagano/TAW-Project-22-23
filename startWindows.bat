@echo off
@echo off

set restore=false
set electron=false

for %%a in (%*) do (
    if "%%a" == "--restore" (
        set restore=true
    ) 
    if "%%a" == "--electron" (
        set electron=true
    )
)

if %restore% == true (
    echo ------------ RESTORE ------------
    docker cp .\DBDump\dump mongodb:/dump 
    docker exec mongodb mongorestore --db MioDB --drop /dump/MioDB
)

if %electron% == true (
    echo ------------ ELECTRON ------------
    cd .\ElectronView
    npm install
    npm start
)

