Welcome to restaurant application

This is a step-by-step guide for bot the application

1)  First you must have installed docker and docker-compose in you machine, and node.js for the electron part

2)  Second, you must create a docker net with the command:

        docker network create taw-subnet

3)  You must build the images, so go in the root folder and type:

        docker-compose build

4)  Then you must create the conteiner, so go in the root folder and type:

        docker-compose up

5)  Now it's all setupped, so you can visit in a Broswer : http://localhost (is not necessary include the port)

7) now the application is correctly setupped, so you can access with the various kinds of users and visualize the content of the application

8) This last step is unnecessay, but if you want you can use electron to run the web application, you must just type the command

        ./startMacOrLinux.sh

        or if Windows

        .\startWindows.bat

        with the flags
                 --restore      if you want to popolate the database with a set of data already prebuilds 
                 --electron     for start the electron view







Thanks 

Pagano Matteo 880833





