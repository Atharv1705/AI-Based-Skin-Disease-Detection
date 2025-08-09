# Dermascan Quest

## Backend API

This project now includes a local backend to replace Supabase for auth, profiles, avatar uploads, and AI endpoints.

### Start backend

1. Install dependencies

```
npm install
```

2. Run API server

```
npm run server
```

Server runs at `http://localhost:4000` by default. You can override with `PORT` env var.

### Configure frontend

Create `.env` or `.env.local` and set:

```
VITE_API_BASE_URL=http://localhost:4000
```

Then run the frontend with `npm run dev`.

### API keys

Gemini API key is used by the backend. Set environment variable `GEMINI_API_KEY` when starting the server. If not provided, the current key in use remains as default and is not removed.

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS