# Testing Guide for Dr. Mbita Emmanuel's Website

This document provides comprehensive information about the test suite for the academic website.

## 🧪 Test Framework

- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **ts-node**: TypeScript execution for Jest

## 📁 Test Structure

```
__tests__/
├── components/          # Component tests
│   ├── SlideCard.test.tsx
│   └── SlideGrid.test.tsx
├── api/                 # API route tests
│   └── alumni/
│       ├── directory.test.ts
│       └── jobs.test.ts
└── lib/                 # Utility tests
    ├── logger.test.ts
    └── validation.test.ts
```

## 🚀 Running Tests

### Install Dependencies

First, install the testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest ts-node
```

### Run All Tests

```bash
npm test
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### CI Mode (for Continuous Integration)

```bash
npm run test:ci
```

## 📝 Test Coverage

### Components

#### SlideCard Component
- ✅ Renders without crashing
- ✅ Displays title, description, and date correctly
- ✅ Handles left/right direction animations
- ✅ Renders images conditionally
- ✅ Links work correctly

#### SlideGrid Component
- ✅ Renders multiple items
- ✅ Alternates direction by default
- ✅ Applies custom directions
- ✅ Handles empty state
- ✅ Custom className support

### API Routes

#### Alumni Directory API (`/api/alumni/directory`)
- ✅ Returns all alumni
- ✅ Filters by search query
- ✅ Filters by graduation year
- ✅ Handles errors gracefully
- ✅ Returns empty array when no results

#### Alumni Jobs API (`/api/alumni/jobs`)
- ✅ GET: Returns all active jobs
- ✅ GET: Filters by job type
- ✅ GET: Filters by search query
- ✅ GET: Handles errors
- ✅ POST: Creates new job posting
- ✅ POST: Validates input data
- ✅ POST: Handles database errors

### Utilities

#### Logger
- ✅ Logs info messages
- ✅ Logs errors with stack traces
- ✅ Logs warnings
- ✅ Debug logging in development only

#### Validation
- ✅ Email validation
- ✅ URL validation
- ✅ Required field validation
- ✅ Edge case handling

## 🔧 Configuration Files

### jest.config.js
Main Jest configuration with Next.js integration

### jest.setup.js
Test environment setup including:
- Prisma mock
- Environment variables
- Test utilities

## 📊 Coverage Goals

Target coverage metrics:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🎯 Writing New Tests

### Component Test Template

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import YourComponent from '@/components/YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### API Test Template

```typescript
import { GET } from '@/app/api/your-route/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma');

describe('Your API Route', () => {
  it('should return data', async () => {
    (prisma.model.findMany as jest.Mock).mockResolvedValue([]);
    
    const request = new NextRequest('http://localhost:3000/api/your-route');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toBeDefined();
  });
});
```

## 🐛 Debugging Tests

### Run specific test file

```bash
npm test -- SlideCard.test.tsx
```

### Run tests matching pattern

```bash
npm test -- --testNamePattern="should render"
```

### Verbose output

```bash
npm test -- --verbose
```

## 🔄 Continuous Integration

The test suite is configured for CI environments with:
- Maximum 2 workers for resource efficiency
- Coverage reporting
- Non-interactive mode

## 📚 Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Test names describe what they test
3. **Coverage**: Test happy paths and edge cases
4. **Mocking**: Mock external dependencies (Prisma, APIs)
5. **Cleanup**: Clean up after each test

## 🛠️ Troubleshooting

### Issue: Tests timeout
**Solution**: Increase timeout in jest.config.js

### Issue: Module not found
**Solution**: Check path aliases in jest.config.js

### Issue: Prisma mock not working
**Solution**: Verify jest.setup.js mock configuration

## 📖 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Next.js](https://nextjs.org/docs/testing)

---

**Last Updated**: 2024-01-01
**Maintained by**: Development Team
