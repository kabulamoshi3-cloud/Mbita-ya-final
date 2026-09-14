#!/bin/bash

# ============================================================================
# Database Setup Script for Mbita Emmanuel Website
# ============================================================================
# This script automatically sets up the database and seeds initial data
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Mbita Emmanuel - Database Setup Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo -e "${RED}❌ Error: .env file not found!${NC}"
  echo ""
  echo "Please create a .env file with your database connection:"
  echo ""
  echo "DATABASE_URL=\"postgresql://user:password@host:5432/dbname\""
  echo ""
  exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
  echo -e "${RED}❌ Error: DATABASE_URL not found in .env file!${NC}"
  echo ""
  echo "Add this to your .env file:"
  echo "DATABASE_URL=\"postgresql://user:password@host:5432/dbname\""
  echo ""
  exit 1
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js is not installed!${NC}"
  echo "Please install Node.js: https://nodejs.org/"
  exit 1
fi

echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm is not installed!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ npm installed: $(npm --version)${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo ""
  echo -e "${YELLOW}📦 Installing dependencies...${NC}"
  npm install
  echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

echo ""
echo -e "${YELLOW}🗄️  Setting up database...${NC}"
echo ""

# Step 1: Generate Prisma Client
echo -e "${BLUE}1️⃣  Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Step 2: Push database schema
echo -e "${BLUE}2️⃣  Creating database tables...${NC}"
npx prisma db push --accept-data-loss
echo -e "${GREEN}✅ Database tables created${NC}"
echo ""

# Step 3: Seed database
echo -e "${BLUE}3️⃣  Seeding initial data...${NC}"
npx prisma db seed
echo -e "${GREEN}✅ Database seeded with initial data${NC}"
echo ""

# Success message
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Database Setup Complete!                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 What was created:${NC}"
echo "  • Database tables (Profile, Publications, Research, etc.)"
echo "  • Admin user (email: admin@example.com, password: admin123)"
echo "  • Sample data (publications, research projects, events, etc.)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Change the admin password after first login!${NC}"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo "  1. Run: npm run dev"
echo "  2. Open: http://localhost:3000"
echo "  3. Login: http://localhost:3000/login"
echo "     Email: admin@example.com"
echo "     Password: admin123"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
