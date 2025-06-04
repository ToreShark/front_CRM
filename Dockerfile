# Используем официальный образ nginx для раздачи статичных файлов
FROM nginx:alpine

# Копируем статичные файлы в директорию nginx
COPY index.html /usr/share/nginx/html/

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]