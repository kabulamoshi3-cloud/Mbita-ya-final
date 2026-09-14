#!/bin/bash

# ============================================================================
# PostgreSQL Database Creation Script
# ============================================================================
# Creates a new PostgreSQL database for the application
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   PostgreSQL Database Creator                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  echo -e "${RED}❌ PostgreSQL is not installed!${NC}"
  echo ""
  echo "Install PostgreSQL:"
  echo "  • Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
  echo "  • macOS: brew install postgresql"
  echo "  • Windows: Download from https://www.postgresql.org/download/"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ PostgreSQL installed${NC}"
echo ""

# Get database details
echo -e "${YELLOW}📝 Enter database details:${NC}"
echo ""

read -p "Database name [professor_website]: " DB_NAME
DB_NAME=${DB_NAME:-professor_website}

read -p "Database user [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Database password: " DB_PASSWORD
echo ""

read -p "Database host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

echo ""
echo -e "${BLUE}Creating database...${NC}"

# Create database
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Database '$DB_NAME' created successfully!${NC}"
else
  echo -e "${YELLOW}⚠️  Database may already exist or creation failed${NC}"
fi

echo ""
echo -e "${BLUE}📝 Add this to your .env file:${NC}"
echo ""
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\""
echo ""

# Create or update .env file
if [ -f ".env" ]; then
  echo -e "${YELLOW}⚠️  .env file already exists${NC}"
  read -p "Update DATABASE_URL in .env? (yes/no): " update_env
  
  if [ "$update_env" = "yes" ]; then
    # Backup existing .env
    cp .env .env.backup
    
    # Update or add DATABASE_URL
    if grep -q "DATABASE_URL" .env; then
      sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\"|" .env
    else
      echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\"" >> .env
    fi
    
    echo -e "${GREEN}✅ .env file updated${NC}"
    echo -e "${BLUE}Backup saved as .env.backup${NC}"
  fi
else
  echo -e "${BLUE}Creating .env file...${NC}"
  cp .env.example .env 2>/dev/null || touch .env
  sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME\"|" .env
  echo -e "${GREEN}✅ .env file created${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Database Ready!                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🚀 Next step: Run database setup${NC}"
echo "  ./scripts/setup-database.sh"
echo ""
