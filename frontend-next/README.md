# Solvra — Next.js + Tailwind frontend (experimental)

This folder contains a small Next.js + TailwindCSS frontend crafted to match a Modern Huntsman aesthetic: elegant, minimal, premium. It's intended to be integrated alongside the existing `backend/` services (geo-fence, QR, Face ID).

Files added

- `pages/` — Next.js pages: `_app.js` and `index.js`
- `components/` — `Header.js`, `Button.js` (styling for header and buttons)
- `styles/globals.css` — Tailwind imports + color/font variables
- `tailwind.config.js`, `postcss.config.js`, `package.json`

Getting started

1. Open a terminal and cd into the new folder:

```bash
cd frontend-next
```

2. Install dependencies (this will download packages from npm):

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

The app will open at `http://localhost:3000` by default.

Integration note

- The sample page reads `NEXT_PUBLIC_API_URL` to know where the backend lives. Example:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev
```

Design choices (quick)

- Palette: soft off-white background, deep charcoal text, warm gold accent (#C49A6C), muted gray for secondary copy.
- Typography: Playfair Display for headings (serif) + Inter for body copy.
- Spacing: generous paddings and minimal borders/shadows for a premium feel.

Next steps (optional)

- I can run `npm install` + `npm run dev` here to verify everything works locally (it requires network access). Tell me if you want me to run that; otherwise you can run it locally with the commands above.
