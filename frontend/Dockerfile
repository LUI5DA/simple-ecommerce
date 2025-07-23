FROM nginx:alpine

# Eliminar la configuración predeterminada de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos estáticos
COPY ./public/ /usr/share/nginx/html/

# Copiar configuración de nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]