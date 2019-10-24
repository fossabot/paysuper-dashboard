FROM node:10.12-alpine

RUN apk update && apk add git

WORKDIR /application

COPY package.json yarn.lock ./

RUN yarn install

COPY . /application

RUN npm rebuild node-sass && yarn build && yarn install --production

EXPOSE 8080

CMD ["node", "./index.js"]
