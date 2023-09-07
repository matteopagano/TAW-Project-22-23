Welcome to restaurant application

This is a step-by-step guide for bot the application

1)  First you must have installed docker and docker-compose in you machine

2)  Second, you must create a docker net with the command:

        docker network create taw-subnet

3)  You must build the images, so go in the root folder and type:

        docker-compose build

4)  Then you must create the conteiner, so go in the root folder and type:

        docker-compose up

5)  Now it's all setupped, so you can visit in a Broswer : http://localhost (is not necessary include the port)

6)  The last step is to restore the database with a set of data already prebuilds. 
    So If you are using a MAC or Linux machine you must type the following command in the terminal (N.B The componets must be started before you run the command)

        bash mac_linux_restore.sh

    Else, if you are using Windows you must type

        .\windows_restore.bat

7) now the application is correctly setupped, so you can access with the various kinds of users and visualize the content of the application


Thanks 

Pagano Matteo 880833





