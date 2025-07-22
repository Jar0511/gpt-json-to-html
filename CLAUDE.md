# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Install dependencies

```bash
yarn install
```

### Run development server

```bash
yarn dev
```

### Build for production

```bash
yarn build
```

### Preview production build

```bash
yarn preview
```

### Run ESLint

```bash
yarn lint
```

### Format code with Prettier

```bash
yarn format
```

## Project Structure

This is a React + TypeScript + Vite project with the following technologies:

- **React 19** with TypeScript
- **Vite** for build tooling with the @tailwindcss/vite plugin
- **Tailwind CSS v4** for styling (using @import "tailwindcss"; in CSS)
- **ESLint v9** with flat config (eslint.config.js)
- **Prettier** for code formatting
- **Yarn PnP** (Plug'n'Play) for package management without node_modules

## Code Style

- TypeScript is used throughout the project
- Prettier configuration uses tabs for indentation
- Single quotes for strings
- Trailing commas (ES5 style)
- Semicolons are required

## Important Files

- `vite.config.ts` - Vite configuration with React and Tailwind plugins
- `eslint.config.js` - ESLint v9 flat configuration
- `.prettierrc.json` - Prettier configuration
- `src/index.css` - Main CSS file with Tailwind import
- `.yarnrc.yml` - Yarn configuration with PnP enabled
- `yarn.lock` - Yarn lockfile for dependency versions
