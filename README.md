# Quick Setup Locally

## Option 1: Using Docker

```bash
docker compose watch
```

## Option 2: Manual Setup

### 1. Install Dependencies
```bash
cd daily-code
yarn install
```

### 2. Setup Database

#### For Mac and Linux users
```bash
cd packages/db
chmod +x ./setupDB.sh
./setupDB.sh
```

#### For Windows users
```bash
cd packages/db
copy .env.example .env
docker-compose up

# Configure the database connection
# Add your connection string to DATABASE_URL

yarn prisma migrate dev
yarn prisma db seed
```

### 3. Run Locally
```bash
cd ../..
yarn run dev
```
