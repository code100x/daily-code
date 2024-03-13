FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps
RUN npm install -g next

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev"]
