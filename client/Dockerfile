# folosim imaginea Nginx
FROM nginx:alpine

# copiem configurația Nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copiem tot frontend-ul în Nginx
COPY . /usr/share/nginx/html

# expunem portul 80
EXPOSE 80

# pornim Nginx
CMD ["nginx", "-g", "daemon off;"]