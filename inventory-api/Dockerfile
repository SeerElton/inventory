FROM node:16

WORKDIR /inventory-api

RUN ls

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]