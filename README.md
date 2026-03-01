# VTrips – AI-Based Trip Planner for VIT Chennai Students

A smart AI-powered hyperlocal trip planner designed exclusively for VIT Chennai students. Built with React, Node.js, Supabase, and Google Gemini API.

## Features

- **Smart Trip Generator** – AI-powered itinerary based on budget, duration, travel mode, and preferences
- **Cost Estimation** – Rule-based cost breakdown with 10% buffer
- **Save Trips** – Store generated trips in Supabase
- **AI Assistant** – Modify trips with natural language (e.g., "Reduce budget to ₹800")
- **Authentication** – Email sign-in via Supabase Auth

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Frontend | React, Tailwind CSS, Vite |
| Backend  | Node.js, Express  |
| Database | Supabase (PostgreSQL) |
| AI       | Google Gemini API |
| Deploy   | Vercel (Frontend), Render/Railway (Backend) |

## Setup

### 1. Clone and Install

```bash
cd V-TRIPS
npm run install:all
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema in SQL Editor: `supabase/schema.sql`
3. Copy **Project URL** and **anon key** from Settings → API

### 3. Google Gemini API

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enable the Gemini API

### 4. Environment Variables

**Backend** (`backend/.env`):

```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Frontend** (`frontend/.env`):

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
```

### 5. Run Locally

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### Frontend (Vercel)

1. Connect your repo to Vercel
2. Set root directory to `frontend`
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL` (your backend URL)

### Backend (Render / Railway)

1. Create a new Web Service
2. Set root to `backend`
3. Build: `npm install`
4. Start: `npm start`
5. Add env vars: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## API Endpoints

| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| POST   | /api/generate-trip | Generate itinerary (AI)     |
| POST   | /api/modify-trip   | Modify existing trip        |
| POST   | /api/save-trip     | Save trip (auth required)   |
| GET    | /api/my-trips      | List user trips (auth)      |
| DELETE | /api/trip/:id      | Delete trip (auth)          |

## HCI Compliance

- **Visibility of system status** – Loading spinners, success toasts
- **User control** – Reset form, edit/modify trip
- **Consistency** – Unified button styles, color palette
- **Error prevention** – Budget ≥ 0, group size ≥ 1, validation
- **Mobile first** – Responsive layout, cards on small screens

## License

MIT
