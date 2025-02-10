FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM mongo:latest

COPY seed/Companies.json /seed/Companies.json

COPY seed/Users.json /seed/Users.json

CMD mongoimport --host mongodb --db notifications --collection companies --drop --type json --file ./seed/Companies.json --jsonArray && \
    mongoimport --host mongodb --db notifications --collection users --drop --type json --file ./seed/Users.json --jsonArray


