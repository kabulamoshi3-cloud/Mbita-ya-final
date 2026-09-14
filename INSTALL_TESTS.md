# Installing Test Dependencies

## Quick Install

Run this command to install all testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest ts-node
```

## Verify Installation

After installation, verify everything works:

```bash
# Run tests
npm test

# If you get errors, try:
npm run test -- --clearCache
npm test
```

## What Gets Installed

| Package | Purpose |
|---------|---------|
| `jest` | Core testing framework |
| `@testing-library/react` | React component testing utilities |
| `@testing-library/jest-dom` | Custom Jest matchers for DOM |
| `@testing-library/user-event` | User interaction simulation |
| `jest-environment-jsdom` | DOM environment for Jest |
| `@types/jest` | TypeScript types for Jest |
| `ts-node` | TypeScript execution for Jest |

## Troubleshooting

### Problem: Installation hangs or times out

**Solution 1**: Use npm with increased timeout
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest ts-node --timeout=300000
```

**Solution 2**: Install packages one at a time
```bash
npm install --save-dev jest
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
npm install --save-dev jest-environment-jsdom
npm install --save-dev @types/jest
npm install --save-dev ts-node
```

**Solution 3**: Use yarn instead
```bash
yarn add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest ts-node
```

### Problem: "Cannot find module" errors when running tests

**Solution**: Clear Jest cache
```bash
npm test -- --clearCache
```

### Problem: TypeScript errors in tests

**Solution**: Make sure TypeScript is installed
```bash
npm install --save-dev typescript @types/node @types/react
```

## Alternative: Skip Test Installation for Now

If you want to deploy without installing test dependencies:

1. The test files won't affect your build
2. Tests are only used for development
3. You can install them later when needed

## Running Tests on Render

Tests are NOT required for Render deployment. They're only for local development and CI/CD pipelines.

## Next Steps

After successful installation:

1. Read [TESTING.md](./TESTING.md) for usage guide
2. Run `npm test` to execute all tests
3. Run `npm run test:watch` for development
4. Run `npm run test:coverage` for coverage reports

---

**Need Help?**

Check the main [TESTING.md](./TESTING.md) documentation for detailed information.
