## Signaturit Document Management & Digital Signature (Frontend Demo)

Tech stack: React 18 + TypeScript + Vite + Tailwind CSS + Jest + React Testing Library. UI primitives approximate shadcn/ui using Tailwind and Radix Toast.

### Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run test` — run Jest tests

### Features
- Drag-and-drop upload with validation (PDF, DOC/DOCX, XLSX; max 10MB) and progress
- Add multiple signer emails and optional message
- Documents dashboard with filter (All, Pending, Signed, Declined), sort (date/status), and responsive table/card views
- Simulated status updates and toast notifications (Uploaded, RequestSent, Signed, Declined)
- Mobile-first responsive layout

### Notes
- All data is simulated in the React Context; no backend calls.
- Toasts use `@radix-ui/react-toast` with Tailwind styles for a shadcn-like UI.

### Testing
Jest + RTL with unit and a basic integration flow test.

### Development
1. Install deps: `npm install`
2. Run dev server: `npm run dev`


