#!/bin/bash

# Code Quality Check Script
# Run this to identify common issues in the codebase

echo "🔍 Checking code quality..."
echo ""

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES=0

# Check 1: Find console.log statements
echo "1️⃣  Checking for console.log statements..."
CONSOLE_COUNT=$(grep -r "console\." --include="*.ts" --include="*.tsx" app/ components/ lib/ 2>/dev/null | grep -v "node_modules" | wc -l)
if [ "$CONSOLE_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Found $CONSOLE_COUNT console statements${NC}"
  echo "   Run: grep -r 'console\.' --include='*.ts' --include='*.tsx' app/ components/ lib/"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ No console statements found${NC}"
fi
echo ""

# Check 2: Find 'any' types
echo "2️⃣  Checking for 'any' type usage..."
ANY_COUNT=$(grep -r ": any" --include="*.ts" --include="*.tsx" app/ components/ lib/ 2>/dev/null | grep -v "node_modules" | grep -v "// @ts-" | wc -l)
if [ "$ANY_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Found $ANY_COUNT 'any' type usages${NC}"
  echo "   Run: grep -r ': any' --include='*.ts' --include='*.tsx' app/ components/ lib/"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ No explicit 'any' types found${NC}"
fi
echo ""

# Check 3: Find missing error handlers
echo "3️⃣  Checking for error handlers..."
CATCH_COUNT=$(grep -r "catch (error)" --include="*.ts" --include="*.tsx" app/api 2>/dev/null | wc -l)
ERROR_HANDLER_COUNT=$(grep -r "createErrorResponse" --include="*.ts" app/api 2>/dev/null | wc -l)
if [ "$CATCH_COUNT" -gt "$ERROR_HANDLER_COUNT" ]; then
  DIFF=$((CATCH_COUNT - ERROR_HANDLER_COUNT))
  echo -e "${YELLOW}⚠️  Found $DIFF catch blocks not using createErrorResponse${NC}"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ Error handlers look good${NC}"
fi
echo ""

# Check 4: Find missing input validation
echo "4️⃣  Checking for input validation..."
REQUEST_JSON=$(grep -r "await request.json()" --include="*.ts" app/api 2>/dev/null | wc -l)
VALIDATION=$(grep -r "validateRequestBody\|parse\|safeParse" --include="*.ts" app/api 2>/dev/null | wc -l)
if [ "$REQUEST_JSON" -gt "$VALIDATION" ]; then
  DIFF=$((REQUEST_JSON - VALIDATION))
  echo -e "${YELLOW}⚠️  Found $DIFF routes that might need validation${NC}"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ Input validation looks good${NC}"
fi
echo ""

# Check 5: Find TODO/FIXME comments
echo "5️⃣  Checking for TODO/FIXME comments..."
TODO_COUNT=$(grep -r "TODO\|FIXME" --include="*.ts" --include="*.tsx" app/ components/ lib/ 2>/dev/null | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Found $TODO_COUNT TODO/FIXME comments${NC}"
  echo "   Run: grep -r 'TODO\|FIXME' --include='*.ts' --include='*.tsx' app/ components/ lib/"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ No TODO/FIXME comments${NC}"
fi
echo ""

# Check 6: Find hardcoded secrets (basic check)
echo "6️⃣  Checking for potential hardcoded secrets..."
SECRET_PATTERNS="password|secret|api[_-]?key|token|credential"
SECRET_COUNT=$(grep -riE "$SECRET_PATTERNS" --include="*.ts" --include="*.tsx" app/ components/ lib/ 2>/dev/null | grep -v "process.env" | grep -v "// " | grep -v "type " | grep -v "interface " | wc -l)
if [ "$SECRET_COUNT" -gt 0 ]; then
  echo -e "${RED}🚨 Found $SECRET_COUNT potential hardcoded secrets${NC}"
  echo "   Review manually: grep -riE '$SECRET_PATTERNS' --include='*.ts' --include='*.tsx' app/ components/ lib/"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✅ No obvious hardcoded secrets${NC}"
fi
echo ""

# Check 7: Database connection checks
echo "7️⃣  Checking Prisma usage..."
if [ -f "lib/prisma.ts" ] || [ -f "lib/db.ts" ]; then
  echo -e "${GREEN}✅ Prisma client file exists${NC}"
else
  echo -e "${RED}🚨 Prisma client file not found${NC}"
  ISSUES=$((ISSUES + 1))
fi
echo ""

# Check 8: Environment variables
echo "8️⃣  Checking environment variables..."
if [ -f ".env.example" ]; then
  echo -e "${GREEN}✅ .env.example exists${NC}"
  ENV_COUNT=$(grep -v "^#" .env.example | grep -v "^$" | wc -l)
  echo "   Found $ENV_COUNT environment variables defined"
else
  echo -e "${RED}🚨 .env.example not found${NC}"
  ISSUES=$((ISSUES + 1))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ISSUES" -eq 0 ]; then
  echo -e "${GREEN}✨ All checks passed! Code quality looks good.${NC}"
else
  echo -e "${YELLOW}⚠️  Found $ISSUES issue(s) to review${NC}"
  echo ""
  echo "📚 See REFACTORING_GUIDE.md for best practices"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
