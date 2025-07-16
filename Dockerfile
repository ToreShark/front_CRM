# syntax=docker/dockerfile:1

################ ЭТАП 1: СБОРКА ################
FROM node:20.11-alpine AS builder

WORKDIR /app

# Копируем только package*.json для кеширования зависимостей
COPY front_crm/package*.json ./

# ВАЖНО: устанавливаем ВСЕ зависимости (включая devDependencies для сборки!)
RUN npm ci

# Копируем остальные файлы React проекта
COPY front_crm/ .

# Собираем production build
RUN npm run build

################ ЭТАП 2: PRODUCTION ################
FROM nginx:1.27-alpine

# Копируем кастомный конфиг для SPA (с fallback на index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные статические файлы из этапа сборки
COPY --from=builder /app/out /usr/share/nginx/html

# USER 101 убрали - nginx нужны права для логов

# Добавляем health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost || exit 1

# Порт уже открыт в базовом образе, но можно продублировать для ясности
EXPOSE 80

# CMD уже определена в базовом образе nginx:alpine