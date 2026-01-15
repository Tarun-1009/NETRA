# Netra App - AI Coding Guidelines

## Project Overview
Netra is a simple React single-page application built with Vite, focused on a landing page component. The app structure emphasizes minimalism with direct component rendering.

## Architecture
- **Entry Point**: `src/main.jsx` renders `App.jsx` in StrictMode
- **Main Component**: `App.jsx` directly renders `LandingPage.jsx`
- **Component Location**: Place reusable components in `src/components/`
- **Styling**: CSS files co-located with components in `src/`, imported as `./filename.css`

## Development Workflow
- **Start Development**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (outputs to `dist/`)
- **Lint**: `npm run lint` (ESLint with React hooks and refresh plugins)
- **Preview**: `npm run preview` (serve built app)

## Code Patterns
- **React Imports**: Use automatic JSX runtime (React 19+), no need to import React for JSX
- **Component Naming**: PascalCase for component files and functions (e.g., `LandingPage.jsx`)
- **CSS Imports**: Always use relative paths `./filename.css` in component files
- **ESLint Rules**: 
  - No unused vars, but ignores uppercase patterns (constants like `API_KEY`)
  - Enforces React hooks rules and fast refresh compatibility
  - Ignores `dist/` directory

## Common Fixes
- Fix CSS import paths: Change `"landingpage.css"` to `"./landingPage.css"`
- Remove unused React imports in components
- Correct CSS typos (e.g., `background-color:blackl;` → `background-color:black;`)

## Key Files
- [src/App.jsx](src/App.jsx) - Main app component
- [src/LandingPage.jsx](src/LandingPage.jsx) - Primary landing page component
- [src/landingPage.css](src/landingPage.css) - Landing page styles
- [package.json](package.json) - Dependencies and scripts
- [eslint.config.js](eslint.config.js) - Linting configuration</content>
<parameter name="filePath">d:\Dev jam\netra-app\.github\copilot-instructions.md