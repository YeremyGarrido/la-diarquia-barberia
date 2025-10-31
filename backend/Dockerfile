# Usa una imagen base oficial de Node.js (ligera)
FROM node:20-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

#
# CORRECCIÓN: Copia los archivos de dependencias DESDE la subcarpeta 'backend'
#
COPY backend/package*.json ./

# Instala solo las dependencias de producción
# 'ci' es más rápido y fiable para builds
RUN npm ci --omit=dev

#
# CORRECCIÓN: Copia el RESTO del código, pero SOLO de la carpeta 'backend'
#
COPY backend/ .

# Expone el puerto que tu app usa INTERNAMENTE
EXPOSE 8080

# El comando para iniciar tu aplicación
CMD ["npm", "start"]