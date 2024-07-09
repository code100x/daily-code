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

For windows users
```
cd packages/db
yarn prisma migrate dev
yarn prisma db seed
```

> Run locally

```
cd ../..
yarn run dev
```
