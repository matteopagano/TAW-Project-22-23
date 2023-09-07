#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#ifdef _WIN32
#include <windows.h>
#define sleep(x) Sleep(x * 1000)
#else
#include <unistd.h>  // Aggiungi questa linea per includere unistd.h
#endif

int main(int argc, char *argv[]) {
    if (argc == 2 && strcmp(argv[1], "--restore") == 0) {
        printf("Eseguo il ripristino...\n");

        // Copia il dump nella cartella del container Docker
        system("docker cp ./DBDump/dump mongodb:/dump");

        // Esegui il ripristino nel container Docker
        system("docker exec mongodb mongorestore --db MioDB --drop /dump/MioDB");

        // Vai nella cartella "ElectronView"
        chdir("./ElectronView");

        // Esegui npm install
        system("npm install");

        // Esegui npm start (o il comando specifico per avviare Electron)
        system("npm start");
    } else {
        printf("Argomento non valido o assente. Eseguo comunque 'npm install' e 'npm start'...\n");

        // Vai nella cartella "ElectronView"
        chdir("./ElectronView");

        // Esegui npm install
        system("npm install");

        // Esegui npm start (o il comando specifico per avviare Electron)
        system("npm start");
    }

    return 0;
}
