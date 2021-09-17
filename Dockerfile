FROM node:14.17-alpine3.11

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --silent

COPY [".", "."]

RUN npm run build

COPY ormconfig.start.json ./ormconfig.json

CMD [ "npm", "start"]
