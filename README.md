# DevLog Platform UI

React + Vite frontend for the developer blogging platform.

## Stack
- React 18
- React Router
- Tailwind CSS
- Markdown rendering + syntax highlighting

## Project Structure
- `src/pages` route pages
- `src/components` reusable UI/layout/blog components
- `src/context` auth/theme/toast providers
- `src/api` backend API client

## Run UI

From:
`/Users/priyankakalamegam/Project/blog-app/ui`

Install dependencies:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Build:
```bash
npm run build
```

## Environment Variable
- `VITE_API_BASE_URL` (default: `http://localhost:8081/api`)
