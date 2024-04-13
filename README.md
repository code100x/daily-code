# Quick Setup Locally

> Install the Dependencies
```
cd daily-code
yarn install
```
> Copy the env example
```
cd  packages/db
cp .env.example .env
```
> Update the .env file with the database url

>  Sample DATABASE_URL
```
postgresql://postgres:<your-db-pass>@localhost:5432/postgres?schema=public
```
> Actionable docker Postgres setup
```
docker run --name <your-db-name> -p 5432:5432 -e POSTGRES_PASSWORD=<your-db-password> -d postgres
```
>Change <your-db-name> and <your-db-password> with a Database Name and Database Password

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
