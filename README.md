# PixoMind (Frontend)

Turn goals into lasting habits. Create a habit plan (AI-generated or custom), track daily tasks, and see progress on your dashboard.

## Tech stack

- **Next.js (App Router)** + **React** + **TypeScript**
- **Tailwind CSS v4** (plus custom global tokens/styles in `app/globals.css`)
- **Firebase**
    - **Auth** (Google sign-in)
    - **Firestore** (user profile + habit plans)
    - **Firebase AI (Gemini)** for generating intake questions + plans
- **next-themes** (dark/light theme)
- **lucide-react** (icons)

## App flow (high level)

- `/` → entry point (login or try plan flow)
- `/login` → Google sign-in → creates/updates user profile in Firestore → `/dashboard`
- `/define-a-plan` → AI plan (intake questions → generate plan) or Custom plan → saves plan in Firestore
- `/dashboard` → loads saved plans → check off tasks (writes back to Firestore)

## Data model (Firestore)

- `users/{uid}`: user profile (xp, streak, etc.)
- `users/{uid}/plans/{planId}`: saved plans
    - fields: `goal`, `description`, `summary`, `timePerDay`, `tasks[]`, `createdAt`

## Getting started (local)

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install & run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase setup

This app expects a Firebase project with:

- **Authentication**: Google provider enabled
- **Firestore**: enabled (Native mode)
- **Firebase AI**: enabled for your project (Gemini)

### Where config lives

- Firebase client initialization: `lib/firebase/client.ts`
- Auth + Firestore access:
    - `lib/services/auth.service.ts`
    - `lib/services/users.service.ts`
    - `lib/services/plans.service.ts`
- AI prompts + parsing:
    - `lib/ai/client.ts`

### Security notes

The repo currently contains Firebase web config in `lib/firebase/client.ts` (API key, project id, etc.). This is normal for Firebase web apps, but you should still:

- enforce proper **Firestore Security Rules**
- restrict API key usage in Google Cloud (HTTP referrers) if needed

## Scripts

```bash
npm run dev           # start dev server
npm run build         # production build
npm run start         # start production server (after build)
npm run lint          # eslint
npm run format        # prettier (write)
npm run format:check  # prettier (check)
```

## Deploy

### Firebase Hosting (recommended)

If you’re deploying as a static site / hosting (no Cloud Functions):

```bash
firebase deploy --only hosting
```

Notes:

- Firebase project selection is set in `.firebaserc`
- You may need to run `firebase login` first

## Project structure

- `app/`: Next.js routes (App Router)
- `components/`: shared UI/layout/providers
- `features/`: domain types + utilities (e.g. plans)
- `lib/`: integrations (Firebase, AI) + service wrappers

## Troubleshooting

- **Stuck on login or redirect loop**: ensure Google provider is enabled in Firebase Auth and your authorized domains include `localhost`.
- **Firestore permission errors**: check Firestore rules for `users/{uid}` and `users/{uid}/plans/*`.
- **AI generation fails / invalid JSON**: check Firebase AI is enabled for the project and review prompt/parse logic in `lib/ai/client.ts`.
