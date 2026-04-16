# PixoMind

Turn goals into lasting habits.

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Firebase

This app uses Firebase Auth + Firestore.

- **Project selection** is set in `.firebaserc`
- **Web app config** is in `lib/firebase.ts`

## Deploy (Firebase Hosting)

If you don't need Cloud Functions, deploy hosting only:

```bash
firebase deploy --only hosting
```
