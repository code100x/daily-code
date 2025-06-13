#!/bin/bash

# ANSI color codes for professional palette (inspired by Vite CLI)
CYAN='\033[1;36m'   # Bold cyan for headers and prompts
GREEN='\033[1;32m'  # Bold green for success
RED='\033[1;31m'    # Bold red for errors
YELLOW='\033[1;33m' # Bold yellow for warnings
BLUE='\033[1;34m'   # Bold blue for info
GRAY='\033[1;90m'   # Gray for secondary text
NC='\033[0m'        # No Color

# Unicode symbols for modern, professional look
CHECK="✔ "
CROSS="✖ "
INFO="ℹ "
WARN="⚠ "
ARROW="→ "
BOX_TOP=""
BOX_BOTTOM=""

# Function to print a professional header
print_header() {
  echo -e "${CYAN}${BOX_TOP}${NC}"
  echo -e "${CYAN}│ ${ARROW} $1${NC}"
  echo -e "${CYAN}${BOX_BOTTOM}${NC}"
}

# Function to print success message
print_success() {
  echo -e "${GREEN}${CHECK}$1${NC}"
}

# Function to print error message and exit
print_error() {
  echo -e "${RED}${CROSS}Error: $1${NC}"
  echo -e "${GRAY}See /tmp/setupdb.log for details.${NC}"
  exit 1
}

# Function to print info message
print_info() {
  echo -e "${BLUE}${INFO}$1${NC}"
}

# Function to print warning message
print_warning() {
  echo -e "${YELLOW}${WARN}$1${NC}"
}

# Function to display progress bar
show_progress() {
  local pid=$1
  local message=$2
  local width=30
  local progress=0
  local bar=""
  while kill -0 $pid 2>/dev/null; do
    bar=$(printf "${GREEN}%-${width}s${NC}" | tr ' ' '#')
    bar=${bar:0:$((progress * width / 100))}
    printf "\r${YELLOW}${ARROW} $message: [%-*s] %d%%" $width "$bar" $progress
    progress=$((progress + 5))
    [ $progress -gt 100 ] && progress=100
    sleep 0.2
  done
  wait $pid
  if [ $? -eq 0 ]; then
    printf "\r${GREEN}${CHECK}$message: [%-*s] 100%%${NC}\n" $width "$(printf '%*s' $width | tr ' ' '#')"
  else
    printf "\r${RED}${CROSS}$message: [%-*s] Failed${NC}\n" $width "$(printf '%*s' $((width / 2)) | tr ' ' '#')"
    return 1
  fi
}

# Function to run command with progress bar
run_with_progress() {
  local command="$1"
  local message="$2"
  bash -c "$command" &> /tmp/setupdb.log &
  local pid=$!
  show_progress $pid "$message" || print_error "Failed to $message"
}

# Function to migrate and seed the database
migrate_seed_db() {
  print_header "Database Reset"
  print_warning "This action will delete all existing data in the database."
  print_info "Continue with database reset?"
  select choice in "Yes" "No"; do
    case $choice in
      Yes) break ;;
      No) print_error "Database setup cancelled." ;;
      *) print_warning "Please select 'Yes' or 'No'." ;;
    esac
  done
  run_with_progress "npx prisma migrate reset --force --skip-seed" "Resetting database"

  print_header "Database Migration"
  run_with_progress "npx prisma migrate dev" "Applying migrations"

  print_header "Database Seeding"
  run_with_progress "npx prisma db seed" "Seeding database"
}

# Main script starts here
clear
print_header "daily-code Database Setup"

print_info "Welcome to the database setup CLI for daily-code."
echo -e "${GRAY}This script configures your database for local or cloud environments.${NC}"
echo

# Check for .env file
print_header "Environment Setup"
if [ -f .env ]; then
  print_success "Found .env file"
else
  print_warning "No .env file found"
  run_with_progress "cp .env.example .env" "Creating .env file"
fi

# Select database type
print_header "Database Type"
print_info "Select your database environment:"
PS3="$(echo -e "${YELLOW}Select option (1-2): ${NC}")"
options=("Local Database" "Cloud Database")
select db_type in "${options[@]}"; do
  case $db_type in
    "Local Database")
      db_type="l"
      break
      ;;
    "Cloud Database")
      db_type="c"
      break
      ;;
    *) print_warning "Please select a valid option (1-2)." ;;
  esac
done

if [ "$db_type" == "l" ]; then
  # Select local database mode
  print_header "Local Database Mode"
  print_info "Select your local database setup:"
  PS3="$(echo -e "${YELLOW}Select option (1-2): ${NC}")"
  options=("Postgres Server" "Docker Container")
  select db_mode in "${options[@]}"; do
    case $db_mode in
      "Postgres Server")
        db_mode="p"
        break
        ;;
      "Docker Container")
        db_mode="d"
        break
        ;;
      *) print_warning "Please select a valid option (1-2)." ;;
    esac
  done

  if [ "$db_mode" == "p" ]; then
    print_header "Postgres Configuration"
    db_username="postgres"
    print_info "Use a custom database username? (default: postgres)"
    select choice in "Yes" "No"; do
      case $choice in
        Yes)
          read -p "$(echo -e "${YELLOW}Database username: ${NC}")" db_username
          break
          ;;
        No) break ;;
        *) print_warning "Please select 'Yes' or 'No'." ;;
      esac
    done
    read -s -p "$(echo -e "${YELLOW}Database password: ${NC}")" db_password
    echo
    read -p "$(echo -e "${YELLOW}Database name: ${NC}")" db_name
    DATABASE_URL="postgresql://$db_username:$db_password@localhost:5432/$db_name"
  elif [ "$db_mode" == "d" ]; then
    print_header "Docker Configuration"
    DATABASE_URL="postgresql://postgres:password@localhost:5432/daily-code"
  fi
elif [ "$db_type" == "c" ]; then
  print_header "Cloud Database Configuration"
  read -s -p "$(echo -e "${YELLOW}Cloud database URI: ${NC}")" cloud_db_uri
  echo
  DATABASE_URL="$cloud_db_uri"
fi

# Write DATABASE_URL to .env
print_header "Saving Configuration"
echo "DATABASE_URL=\"$DATABASE_URL\"" > .env || print_error "Failed to save database configuration"
print_success "Database configuration saved to .env"

# Start Docker if needed
if [ "$db_mode" == "d" ]; then
  print_header "Docker Setup"
  run_with_progress "docker-compose up -d" "Starting Docker container"
  print_info "Waiting for database to initialize..."
  sleep 15
fi

# Run migration and seeding
migrate_seed_db

# Final summary
print_header "Setup Complete"
print_success "Database setup completed successfully!"
print_info "Next steps:"
echo -e "  ${CYAN}${ARROW} Start the application: ${GRAY}cd ../.. && yarn run dev${NC}"
echo -e "  ${CYAN}${ARROW} Inspect the database: ${GRAY}npx prisma studio${NC}"
echo
print_info "Thank you for using the daily-code Database Setup CLI!"