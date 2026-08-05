FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk add --no-cache openssl

RUN  yarn install

EXPOSE 3000

CMD ["yarn", "run", "dev:docker"]
