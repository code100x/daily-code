# Quick Setup Locally

## Using Docker

```bash
docker compose watch
```

## Manual Setup

### Install Dependencies

```bash
cd daily-code
yarn install
```

### Setup Database

#### For Mac and Linux Users
```bash
cd packages/db
chmod +x ./setupDB.sh
./setupDB.sh
```

#### For Windows Users
```bash
cd packages/db
copy .env.example .env
docker-compose up

# Now, write the connection string in DATABASE_URL

yarn prisma migrate dev
yarn prisma db seed
```

### Run Locally

```bash
cd ../..
yarn run dev
```
