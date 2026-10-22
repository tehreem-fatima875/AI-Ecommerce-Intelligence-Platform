# Meridian Commerce Intelligence

Meridian is a single-store commerce operations dashboard built with Next.js, Express, and MongoDB. It reports revenue, order activity, product inventory, customer segments, and rule-based recommendations. Recommendations are data rules; no external AI model is currently connected.

## Run locally

Requirements: Node.js 20+, npm, and MongoDB.

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
2. In `backend`, run `npm ci` and `npm run dev`.
3. In `frontend`, run `npm ci` and `npm run dev`.
4. Open `http://localhost:3000`.

The Next.js server proxies dashboard requests to `BACKEND_API_URL` (defaults to `http://localhost:5000/api`). For a local backend with an API key, set the same `API_WRITE_KEY` in both `backend/.env` and `frontend/.env.local`.

## Production deployment

The repo is configured for **Netlify (Next.js frontend) + Render (Express API) + MongoDB Atlas**. Netlify supports the App Router and Next.js route handlers, including the server-side API proxy in this project. Render runs the existing Node/Express backend as a web service. See [`netlify.toml`](netlify.toml) and [`render.yaml`](render.yaml) for build and service settings.

### 1. Confirm MongoDB Atlas access

- Use the existing dedicated database user and set its role to `readWrite` on `ai_ecommerce`.
- In Atlas Network Access, allow the Render service to connect. Keep the database private; do not use unrestricted network access for production.
- The local [`backend/.env`](backend/.env) is ignored by Git and now targets `ai_ecommerce`. Do not commit it or paste its credentials into source files.

### 2. Deploy the API to Render

1. Push this repository to a Git provider you can access.
2. In Render, choose **New → Blueprint** and connect the repository containing `render.yaml`.
3. Review the `meridian-api` web service and create it. Render will prompt for `MONGODB_URI`; copy the URI from your secret manager or local ignored `backend/.env`. It must end with `/ai_ecommerce` before any query string. Render generates `API_WRITE_KEY` for the API.
4. Wait for the deployment health check at `/health` to pass, then copy the service URL (for example, `https://meridian-api.onrender.com`).

### 3. Deploy the frontend to Netlify

1. In Netlify, choose **Add new project → Import an existing project**, select the Git provider and repository, and deploy. The root `netlify.toml` sets the base directory to `frontend` and the build command to `npm run build`.
2. In the Netlify project’s environment variables, add `BACKEND_API_URL` with the Render URL plus `/api`, such as `https://meridian-api.onrender.com/api`.
3. Add `API_WRITE_KEY` with the exact generated value from Render. Keep it server-side; never prefix it with `NEXT_PUBLIC_`. Make it available to the Next.js server/function runtime as well as builds if Netlify asks for a scope.
4. Trigger a new deploy after saving the variables. The browser calls the same-origin Next.js route; that server route forwards to Render and adds the API key.

### 4. Verify the live deployment

- Open `https://<render-service>.onrender.com/health`; expect `status: "ok"` and `database: "connected"`.
- Open `https://<netlify-site>/api/analytics`; expect JSON with real counts from `ai_ecommerce` (currently empty, so metrics should be zero rather than fabricated).
- Check the Netlify deploy log and load the dashboard. If the proxy returns 502, verify `BACKEND_API_URL`, Render health, and the matching `API_WRITE_KEY` on both services.

I cannot complete those live checks until the Git repository is pushed and the services are created in your Render and Netlify accounts. Do not expose the dashboard publicly until access is restricted through your identity provider or an access gateway: this app has no user login or tenant isolation.

### Docker deployment alternative

The root `docker-compose.yml` remains available for a host that runs Docker Compose. Copy `.env.example` to `.env`, set `MONGODB_URI` for `ai_ecommerce` and a strong `API_WRITE_KEY`, then run `docker compose up --build -d`. The API is internal to the Compose network; the web container is published on `WEB_PORT` (3000 by default).

### Access control

`API_WRITE_KEY` is a shared service credential between the Next.js proxy and the API. It is never sent to the browser. The application has no user accounts, roles, or tenant isolation: anyone who can reach the dashboard can see that store's data. Put the web service behind your identity provider's SSO/access gateway before exposing it publicly, and restrict access to trusted operators. Rotate the API key through your deployment secret manager.

## Configuration

| Variable | Service | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | API | MongoDB connection string; required |
| `API_WRITE_KEY` | API and web | Shared API credential; required in production |
| `CORS_ORIGINS` | API | Comma-separated allowed origins (local default: `http://localhost:3000`; dashboard requests are proxied server-side) |
| `PORT` | API or web | Listening port (5000 or 3000 locally; hosting platforms provide it) |
| `BACKEND_API_URL` | Web | Server-only API base URL, including `/api` (local default: `http://localhost:5000/api`) |
| `WEB_PORT` | Compose | Host port for the dashboard (3000 by default) |

For non-Compose deployments, set `BACKEND_API_URL` and `API_WRITE_KEY` as server-only runtime secrets on the Next.js service, and set `MONGODB_URI` and `API_WRITE_KEY` on the API service. Do not use a `NEXT_PUBLIC_` prefix for secrets.

## Current scope

- Analytics are calculated from all records currently stored; there are no date-range controls or store integrations/import pipeline.
- The app does not seed or fall back to demo metrics. An empty `ai_ecommerce` database produces zero totals and empty states until real records are imported.
- Currency is displayed as USD. Store-specific currency settings are not implemented.
- Product, customer, and order write endpoints are intended for trusted integrations. Requests require `x-api-key` when `API_WRITE_KEY` is configured.
- AI insights are deterministic business rules, not model-generated forecasts.
- The service expects MongoDB to be provisioned separately; Compose does not start a database container.
