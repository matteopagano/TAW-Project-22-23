# Usa un'immagine di base con Node.js preinstallato
FROM node as build

# Crea e imposta la directory di lavoro all'interno del container
WORKDIR /app/Frontend

# Copia il package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze dell'app
RUN npm install

# Copia il resto del codice dell'app nella directory di lavoro
COPY . .

# Build dell'app Angular
RUN npm run build

# Utilizza un'immagine di produzione più leggera
FROM nginx:alpine

# Copia i file di produzione dell'app Angular nella directory corretta di Nginx
COPY --from=build /app/Frontend/dist/restaurant /usr/share/nginx/html

# Esponi la porta 80 per il server Nginx
EXPOSE 80

# Avvia il server Nginx
CMD ["nginx", "-g", "daemon off;"]
