## Signaturit Document Management & Digital Signature (Frontend Demo)
[![Node Version](https://img.shields.io/badge/node-22+-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.6+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-18.3+-61DAFB?logo=react)](https://react.dev/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest?logo=shadcn&logoColor=white)](https://ui.shadcn.com/)
[![Vite](https://img.shields.io/badge/vite-5.4+-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4.1-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Tested with Jest](https://img.shields.io/badge/tested_with-jest-994250?logo=jest)](https://jestjs.io/)


Tech stack: React 18 + TypeScript + Vite + Tailwind CSS + Jest + React Testing Library. 
All the UI or atoms components are from `shadcn`

### Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run test` — run Jest tests

### Features
- Drag-and-drop upload with validation (PDF, DOC/DOCX, XLSX; max 10MB) and progress
- Add multiple signer emails and optional message
- Documents dashboard with filter (All, Pending, Signed, Declined), sort (date/status), and responsive table/card views
- Simulated status updates and toast notifications (Uploaded, RequestSent, Signed, Declined)
- Mobile-first responsive layout

### Notes
- All data is simulated in the React Context; no backend calls.

### Testing
Jest

### Development
1. Install deps: `npm install`
2. Run dev server: `npm run dev`


