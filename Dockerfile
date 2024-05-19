FROM node:20-alpine

WORKDIR usr/src/app

# build optimisation 
COPY package.json ./
COPY yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/store/package.json ./packages/store/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/common/package.json ./packages/common/
COPY packages/ui/package.json ./packages/ui/

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev:docker"]
