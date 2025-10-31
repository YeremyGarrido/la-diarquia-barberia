# Usa una imagen oficial de Node.js
FROM node:20-alpine

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install --omit=dev

# Copia el resto del código fuente
COPY . .

# Define las variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080

# Expone el puerto que Fly usará
EXPOSE 8080

# Comando para ejecutar el servidor
CMD ["node", "server.js"]
