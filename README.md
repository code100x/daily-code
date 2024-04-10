# quick start dailycode

> Install Dependencies
```
cd daily-code
yarn install
```
> Copy the env example
```
cd /packages/db
cp .env.example .env
```
Update the .env file with the database url

> Migrate and the Database
```
npx prisma migrate dev
npx prisma db seed
```
> Run locally
```
cd ../..
yarn run dev
```
