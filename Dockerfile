FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN  yarn install

RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

EXPOSE 3000

CMD ["yarn", "run", "dev:docker"]
