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
RUN npm run build --prod

# Usa un'immagine leggera di Nginx per servire l'app Angular
FROM nginx:latest

# Copia l'output del build dell'app Angular nella directory di default di Nginx
COPY --from=build /app/dist/restaurant /usr/share/nginx/html

# Espone la porta 80 su cui l'app sarà in ascolto
EXPOSE 80
