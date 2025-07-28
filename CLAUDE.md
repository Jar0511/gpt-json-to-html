# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

이 프로젝트는 GPT 데이터 내보내기로 가져온 데이터를 아름다운 HTML로 변환하는 기능을 제공합니다.

- 원페이지, 서버리스 웹서비스를 위한 프론트엔드 소스코드입니다: 즉, 파일을 컨트롤하는 부분도 모두 클라이언트 사이드에서 수행합니다.
- JSON 대화 파일을 읽어 HTML로 변환한 후, zip으로 압축합니다.
  - 변환된 결과물 파일 구조
    ```
    │  index.html
    ├─ pages/
    │  └─ some-chat.html
    ├─ style/
    │  └─ main.css
    ├─ js/
    │  └─ script.js
    └─ images/
       └─ some-image.png
    ```

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

### Code Quality

ESLint has been removed from this project due to configuration issues. Please ensure code quality manually by following TypeScript best practices and the project's code style guidelines.

### Format code with Prettier

```bash
yarn format
```

## Project Structure

This is a React + TypeScript + Vite project with the following technologies:

- **React 19** with TypeScript
- **Vite** for build tooling with the @tailwindcss/vite plugin
- **Tailwind CSS v4** for styling (using @import "tailwindcss"; in CSS)
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
- `.prettierrc.json` - Prettier configuration
- `src/index.css` - Main CSS file with Tailwind import
- `.yarnrc.yml` - Yarn configuration with PnP enabled
- `yarn.lock` - Yarn lockfile for dependency versions

## Development Guidelines

- Windows 11 환경에서는 yarn 명령어 대신 npx를 사용하여 스크립트를 실행하세요:
  - `yarn format` → `npx prettier --write . --cache --cache-location ./.cache/.prettier-cache`
  - `yarn dev` → `npx vite`
  - `yarn build` → `npx tsc -b && npx vite build`
  - `yarn preview` → `npx vite preview`

## Import Guidelines

- src/ 아래 파일을 import 할 때는 '@/'로 시작하는 절대 경로로 작성하십시오
