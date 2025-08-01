# Etapa 1: Build
FROM node:18-alpine AS build

# Establece directorio de trabajo
WORKDIR /app

# Copia dependencias e instala
COPY package*.json ./
RUN npm install

# Copia el resto del código y construye el proyecto
COPY . .
RUN npm run build

# Etapa 2: Nginx para servir la app
FROM nginx:alpine

# Copia el build generado a la carpeta pública de nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia configuración personalizada de nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto por defecto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
