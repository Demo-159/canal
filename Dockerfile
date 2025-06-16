# Dockerfile para canal 24/7
FROM node:18-alpine

# Instalar FFmpeg
RUN apk add --no-cache ffmpeg

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear directorio para HLS
RUN mkdir -p hls public

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
