# Usa un'immagine di base con Node.js preinstallato
FROM node as build

# Crea e imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia il package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze dell'app
RUN npm install

# Copia il resto del codice dell'app nella directory di lavoro
COPY . .

# Build dell'app Angular
CMD ["ng", "serve"]

#prova
