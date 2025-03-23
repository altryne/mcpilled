# Commands

## Frontend (Next.js)
- `cd src && npm run dev` - Start development server
- `cd src && npm run build` - Build project
- `cd src && npm run start` - Start production server
- `cd src && npm run lint` - Lint frontend code

## Backend (Firebase Functions)
- `cd functions && npm run build` - Build TypeScript functions
- `cd functions && npm run lint` - Lint functions code
- `cd functions && npm run serve` - Run functions locally
- `cd functions && npm run deploy` - Deploy functions

# Code Style Guidelines

## Frontend (.js)
- Use double quotes for strings
- Import ordering: React, libraries, local components/utils
- Component naming: PascalCase
- Variables/functions: camelCase
- Use PropTypes for component props validation
- React functional components with hooks (no class components)
- Use clsx for conditional class names

## Backend (.ts)
- TypeScript with strict typing
- 2-space indentation
- Double quotes for strings
- Explicit error handling with try/catch
- Proper type definitions for functions and variables
- Async/await pattern for asynchronous operations