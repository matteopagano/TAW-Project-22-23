#!/bin/bash

docker cp ./DBDump/dump mongodb:/dump 

docker exec mongodb mongorestore --db MioDB --drop /dump/MioDB