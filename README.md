# FridgeAI

A recipe suggestion app that uses AI to generate recipe ideas from ingredients you have on hand. Enter a comma-separated list of ingredients, and get back up to five recipes.

## Features

- **Two recipe sources** — **Recipe sites** (TheMealDB, free, no key): real recipes with real photos. **AI** (Mistral): generated suggestions in your language.
- **Multi-language UI** — English (default), Russian, Spanish, German with persisted preference.
- **Local history** — Last successful result is restored on page load; recent searches (last 5) are stored in a file on the server and are clickable to re-run.
- **Clear states** — Empty, loading, error, and success states with inline error messages.
- **Rate limiting** — In-memory per-IP throttling on the API to reduce abuse.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Mistral API (mistral-small-latest) via `@mistralai/mistralai` SDK
- **Storage:** `localStorage` for last search and locale; history in `data/search-history.json` on the server (per-IP), with localStorage fallback when the file is not writable (e.g. serverless)

## Setup

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn

### Install

```bash
git clone <repo-url>
cd AIRecipeFinder
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

| Variable          | Required | Description                                                                 |
|-------------------|----------|-----------------------------------------------------------------------------|
| `MISTRAL_API_KEY` | For AI   | Mistral API token (for "AI" source). [Mistral Console](https://console.mistral.ai). |

"Recipe sites" uses [TheMealDB](https://www.themealdb.com/api.php) (free, no key). It filters by the first ingredient; English ingredient names usually work best. Do not commit `.env.local`.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the language selector (top right) to switch UI language. Enter ingredients (e.g. `chicken, rice, onion`) and click **Generate**.

### Build for Production

```bash
npm run build
npm start
```

## Deploy (Vercel)

1. Push the repo to GitHub (or connect another Git provider in Vercel).
2. In [Vercel](https://vercel.com), **Add New Project** and import the repository.
3. In **Settings → Environment Variables**, add `MISTRAL_API_KEY` (and optionally set it for Production/Preview).
4. Deploy. Vercel will use the built-in Next.js preset and run `next build` / `next start`.

No extra config is required for the App Router or API routes.

## Troubleshooting

### "Recipe service is temporarily unavailable" or no recipes

- **Missing API key:** Ensure `MISTRAL_API_KEY` is set in `.env.local` (local) or in the deployment environment (e.g. Vercel). Restart the dev server after adding the key.
- **Invalid key:** Check the token at [Mistral Console](https://console.mistral.ai). Revoked or incorrect keys cause 503-style responses.

### "Recipe generation failed. Please try again." (502)

- The model sometimes returns non-JSON or malformed JSON. The app tries to extract and parse JSON; if that fails, it returns this message. Retrying usually works. If it persists, the prompt or model may need adjustment in `services/ai.ts`.

### "Too many requests" (429)

- The API applies a simple in-memory rate limit per IP (e.g. one request every 15 seconds). Wait a moment and try again. In serverless environments the limit is per instance, not global.

### Port already in use

- If port 3000 is busy, run `npm run dev -- -p 3001` (or another port) and open the URL shown in the terminal.

### History not persisting across deploys

- History is stored in `data/search-history.json` on the server. On serverless (e.g. Vercel) the filesystem is often read-only or ephemeral, so the app falls back to `localStorage` for history in the browser. For persistent file-based history, run the app on a Node server with a writable disk (e.g. VPS, Docker).
