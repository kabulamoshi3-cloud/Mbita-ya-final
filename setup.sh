#!/bin/bash

# ============================================================================
# Complete Application Setup Script
# ============================================================================
# One command to set up everything: dependencies, database, and run app
# ============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

clear

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║     Mbita Emmanuel Website - Complete Setup           ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Step 1/3: Installing dependencies...${NC}"
echo ""
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Set up database
echo -e "${YELLOW}🗄️  Step 2/3: Setting up database...${NC}"
echo ""

if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠️  No .env file found. Creating from example...${NC}"
  cp .env.example .env
  echo -e "${RED}❌ Please update .env with your database credentials!${NC}"
  echo ""
  echo "Edit the DATABASE_URL in .env file:"
  echo "DATABASE_URL=\"postgresql://user:password@host:5432/dbname\""
  echo ""
  echo "Then run: ./scripts/setup-database.sh"
  exit 1
fi

./scripts/setup-database.sh

echo ""
echo -e "${YELLOW}🚀 Step 3/3: Starting development server...${NC}"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Setup Complete!                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Your application is ready!${NC}"
echo ""
echo -e "${YELLOW}Default Admin Credentials:${NC}"
echo "  📧 Email: admin@example.com"
echo "  🔑 Password: admin123"
echo ""
echo -e "${RED}⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!${NC}"
echo ""
echo -e "${BLUE}Starting server...${NC}"
echo ""

# Start the development server
npm run dev
