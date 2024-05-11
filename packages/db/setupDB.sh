echo "=================DB Setup================="

# Defining Default values to variables
docker_running="N"

function migrate_seed_db () {
  echo "=================Migrating DB================="
  migration_output=$(npx prisma migrate dev)

  if [[ $migration_output == *"The following migration(s) have been applied"* ]]; then
    echo "Migration already applied. Skipping seeding."
  else
    echo "Migration not applied. Proceeding to seed."
    echo "=================Seeding DB================="
    npx prisma db seed
  fi
}

if [ -f .env ]; then
  echo ".env file exists"
else
  echo ".env file does not exist"
  cp .env.example .env
fi

echo "Will you use a Local DB (L) or Cloud DB (C)"
read db_type

if [ "$db_type" == 'L' ]; then
  echo "Will you use Postgres Server (P) or Docker Setup (D)"
  read db_mode

  if [ "$db_mode" == 'P' ]; then
    db_username="postgres"
    echo "Have you specified a username while setting up your server(Y/N)?"
    read is_username

    if [ "$is_username" == "Y" ];then
      echo "Enter your db password: "
      read db_username
    else
      db_username="postgres"
    fi

    echo "Enter your db password: "
    read db_password
    echo "Enter your db name: "
    read db_name
    DATABASE_URL="postgresql://$db_username:$db_password@localhost:5432/$db_name"
  elif [ "$db_mode" == 'D' ]; then
    echo "Setting up Docker"
    DATABASE_URL="postgresql://postgres:password@localhost:5432/100xdevs"
  else
    echo "Invalid Option"
  fi

elif [ "$db_type" == 'C' ]; then
  echo "Enter the DB URI of your Cloud DB"
  read cloud_db_uri
  DATABASE_URL=$cloud_db_uri
else
  echo "Invalid Option"
  exit 1
fi

echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
if [ "$db_mode" == 'D' ]; then
  docker-compose up -d
  if [ $? -eq 0 ]; then
      echo "=================Container is up================="
      sleep 15
  else
      echo "Please make sure that docker is running"
      exit 1
  fi
fi

migrate_seed_db