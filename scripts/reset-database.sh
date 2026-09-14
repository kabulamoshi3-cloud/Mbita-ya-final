#!/bin/bash

# ============================================================================
# Database Reset Script
# ============================================================================
# WARNING: This will delete ALL data and recreate the database
# ============================================================================

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║   ⚠️  DATABASE RESET - ALL DATA WILL BE DELETED!      ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}This will:${NC}"
echo "  • Delete all existing tables"
echo "  • Recreate the database schema"
echo "  • Seed fresh data"
echo ""

read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo ""
  echo -e "${GREEN}✅ Reset cancelled. No changes made.${NC}"
  exit 0
fi

echo ""
echo -e "${RED}🗑️  Resetting database...${NC}"
echo ""

# Reset database
npx prisma migrate reset --force --skip-generate

echo ""
echo -e "${GREEN}✅ Database reset complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Default admin credentials:${NC}"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
