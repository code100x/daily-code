FROM node:18-alpine
# Set working directory
WORKDIR /app

# RUN yarn global add turbo

COPY . .

RUN yarn install

RUN yarn build --filter=web...

EXPOSE 3000

CMD ["yarn", "dev"]