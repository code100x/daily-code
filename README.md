# Quick Setup Locally

* Docker

```
docker compose watch
```

    OR

> Install the Dependencies

```
cd daily-code
yarn install
```

> Setup DB
For Mac and Linux users
```
cd packages/db
chmod +x ./setupDB.sh
./setupDB.sh
```

For Windows users (using docker to start db locally)
```
cd packages/db
copy .env.example .env
docker-compose up

now, write the connection string in DATABASE_URL

yarn prisma migrate dev
yarn prisma db seed
```

> Run locally

```
cd ../..
yarn run dev
```
