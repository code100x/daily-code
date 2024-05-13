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

> Setup DB (Windows users must have git-bash installed to run the script)

```
cd packages/db
chmod +x ./setupDB.sh
./setupDB.sh
```

> Run locally

```
cd ../..
yarn run dev
```
