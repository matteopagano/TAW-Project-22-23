# Usa un'immagine di base Node.js
FROM node:14

#RUN npm install -g typescript



RUN mkdir -p /app/Backend
WORKDIR /app/Backend
COPY package.json package-lock.json /app/Backend/
RUN npm install

COPY /compiledSourceJS/ /app/Backend/compiledSourceJS

COPY /tsconfig.json /app/Backend/

# Copia il resto del codice sorgente nell'immagine


# Espone la porta su cui l'applicazione Express ascolterà le richieste
EXPOSE 3000

#ENTRYPOINT ["tail", "-f", "/dev/null"]
# Comando da eseguire quando il container viene avviato
#CMD ["npm", "run", "test"]
CMD ["node", "./compiledSourceJS/Backend/server.js"]