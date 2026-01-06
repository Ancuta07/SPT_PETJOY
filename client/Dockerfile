# folosim imaginea Nginx
FROM nginx:alpine

# copiem tot frontend-ul în Nginx
COPY . /usr/share/nginx/html

# expunem portul 80
EXPOSE 80

# pornim Nginx
CMD ["nginx", "-g", "daemon off;"]