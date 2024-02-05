FROM node:16

WORKDIR /tmphoto_app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]


