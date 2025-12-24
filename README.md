# StreamRecorder

## Architecture

```bash
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 Internet / Users                                    │
│                              (Browser accessing app)                                │
└────────────────────────────────────┬────────────────────────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
   ┌───────▼───────────┐    ┌───────▼───────────┐    ┌────────▼────────┐
   │     Frontend      │    │     Backend       │    │   S3 Storage    │
   │     xxxx.com      │    │  strapi.xxx.com   │    │   cdn.xxx.com   │
   │                   │    │                   │    │                 │
   │ ┌───────────────┐ │    │ ┌───────────────┐ │    │ ┌─────────────┐ │
   │ │   Next.js     │◄├────┼─┤    Strapi     │ │    │ │  Recordings │ │
   │ └───────┬───────┘ │    │ └───────┬───────┘ │    │ │  Thumbnails │ │
   └─────────┼─────────┘    └─────────┼─────────┘    │ └─────────────┘ │
             │                        │              └────────▲────────┘
             │                        │                       │
             └────────────┬───────────┘                       │
                          │                                   │
                 ┌────────▼────────┐                          │
                 │   PostgreSQL    │                          │
                 │    Database     │                          │
                 └─────────────────┘                          │
                                                              │
                                                              │ Upload recordings
                             ┌────────────────┐               │
                             │ Workflow Queue │               │
                             │  (Automation)  │               │
                             └───────┬────────┘               │
                                     │                        │
                                     │ Dispatches             │
                   ┌─────────────────┼─────────────────┐      │
                   │                 │                 │      │
          ┌────────▼───────┐ ┌───────▼───────┐ ┌──────▼──────┴┐
          │   Worker 1     │ │   Worker 2    │ │   Worker N   │
          │ ┌────────────┐ │ │ ┌───────────┐ │ │ ┌──────────┐ │
          │ │  TikTok    │ │ │ │  TikTok   │ │ │ │  Twitch  │ │
          │ │  Recorder  │ │ │ │  Recorder │ │ │ │  Recorder│ │
          │ └─────┬──────┘ │ │ └─────┬─────┘ │ │ └────┬─────┘ │
          └───────┼────────┘ └───────┼───────┘ └──────┼───────┘
                  │                  │                │
                  └──────────────────┼────────────────┘
                                     │
                            ┌────────▼────────┐
                            │      Redis      │
                            │    Job Queue    │
                            └─────────────────┘
```

## Auto Deploy (Coolify)

1. In **Coolify** → Your App → Webhooks:

   - Add a GitHub Webhook Secret
   - Click Save

2. In **GitHub** → Settings → Webhooks → Add webhook:
   - Payload URL: `https://coolify.tiktokrecorder.com/webhooks/source/github/events/manual`
   - Content type: `application/json`
   - Secret: Same as Coolify
   - Events: Just the push event

Push to `main` → auto deploys.

## Deployment Environment (Coolify)

1. **PostgreSQL Database** - Data storage
2. **Strapi Backend** - API server
3. **Next.js Frontend** - Web server

## Strapi Backend - Setup & Deployment Guide

### 1. Database Setup (Local)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE strapi;
\q
```

### 2. Environment Variables (.env)

Create `.env` file in `/backend`:

```bash
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_SSL=false
JWT_SECRET=XXXX

# Strapi Auth
APP_KEYS=XXXX
API_TOKEN_SALT=XXXX
ADMIN_JWT_SECRET=XXXX
TRANSFER_TOKEN_SALT=XXXX
ENCRYPTION_KEY=XXXX

AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

### 3. Start Strapi

Deploy

## Frontend (Next.js) - Setup & Deployment Guide

### 1. Environment Variables (.env.local)

Create `.env.local` file in `/frontend`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_S3_URL=https://domain.com/bucket
```

**Note:** `NEXT_PUBLIC_*` variables are exposed to browser (safe for public URLs).

## GitHub Changelog Setup

1. Generate a secret key and add it to your Strapi `.env` file:

   ```bash
      GITHUB_WEBHOOK_SECRET=your-secret-here
   ```

2. Go to your GitHub repo → Settings → Webhooks → Add webhook

3. Configure the webhook:

   - **Payload URL:** `https://your-domain.com/api/change-log/github-webhook`
   - **Content type:** `application/json`
   - **Secret:** Same value as `GITHUB_WEBHOOK_SECRET`
   - **Events:** Select "Let me select individual events" → check only **Releases**

4. Click "Add webhook"

Now when you publish a release on GitHub, the version and changelog body will automatically be saved to Strapi.

## 4. Start

Deploy
