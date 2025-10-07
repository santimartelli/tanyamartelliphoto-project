FROM node:18

WORKDIR /tmphoto_app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]


