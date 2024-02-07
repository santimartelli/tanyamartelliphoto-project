# Fase 1 : compilación
FROM node:16 as build-stage

WORKDIR /tmphoto_app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase 2 : producción
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /tmphoto_app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
