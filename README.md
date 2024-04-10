# quick start dailycode

install yarn in your system.

install dependencies
yarn install

seed database inside packges/db
yarn run migrate dev
yarn run db:seed or yarn run db:firebase

start development
yarn run dev

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` applications
- `@repo/db`: `prisma` schema and migration (includes `seed` and `migrate` files)
- `@repo/store`: `recoil` store
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages,

- create a .env file in packages/db folder and use postgres connection string there
- run the following command:

```
cd packages/db
yarn prisma migrate dev
yarn run db:seed
yarn run db:firebase

cd ../../
yarn run build
```

### Develop

To develop all apps and packages,

- create a .env file in packages/db folder and use postgres connection string there
- run the following command:

```
cd packages/db
yarn prisma migrate dev
yarn run db:seed
yarn run db:firebase

cd ../../
yarn run dev
```
