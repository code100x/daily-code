# Quick Start Guide for DailyCode Project 🚀

## Introduction
Welcome to DailyCode, a project designed to help you streamline your daily coding practices. This guide will walk you through the setup process to get you up and running quickly.

## Prerequisites
Before you begin, make sure you have the following installed on your system:
- Node.js
- Yarn

## Setup Steps

1. **Clone the Repository**
   ```bash
    git clone https://github.com/your-username/dailycode.git
2. Navigate to Project Directory
   ```bash
    cd dailycode
3. Install Dependencies
   ```bash
    yarn install
4. Start Development Server
   ```bash
    yarn run dev
5. Setup DB_URL in Env file
    ```bash
    cd /packages/db/prisma/.env
8. Database Migration
- Navigate to the Prisma directory:
   ```bash
    cd /packages/db/prisma
- Run Prisma migration for development:
   ```bash
    npx prisma migrate dev
- Obtain a database from Neon Tech if you haven't already.
7. Seed the Database
   ```bash
    yarn run db:seed
## Additional Notes
- Note: If you receive an error while seeding, you can copy migrate.ts code to seed.ts temporarily.
- The provided sample script for seeding the database may change according to the schema updates. Always refer to the latest documentation or project updates for accurate information.

