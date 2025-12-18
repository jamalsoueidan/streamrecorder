# StreamRecorder

## Architecture

```bash
┌─────────────────────────────────────────────────────────────────┐
│                         Internet / Users                        │
│                    (Browser accessing app)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼─────────────┐         ┌────────▼────────────┐
   │ Frontend Domain  │         │ Backend Domain      │
   │ xxxx..com        │         │ strapi.xxx.com      │
   │                  │         │                     │
   │ (HTTPS 443)      │         │ (HTTPS 443)         │
   │ ┌──────────────┐ │         │ ┌────────────────┐  │
   │ │   Next.js    │ │         │ │    Strapi      │  │
   │ │   Port 3000  │ │         │ │   Port 1337    │  │
   │ └──────────────┘ │         │ └────────────────┘  │
   └────────────────┬─┘         └────────┬────────────┘
                    │                    │
                    │  HTTP Requests     │
                    │  (Fetch API)       │
                    │                    │
                    └────────┬───────────┘
                             │
                    ┌────────▼──────────┐
                    │   PostgreSQL      │
                    │   Database        │
                    │   Port 5432       │
                    └───────────────────┘
```

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
```

### 3. Start Strapi

Deploy

## Frontend (Next.js) - Setup & Deployment Guide

### 1. Environment Variables (.env.local)

Create `.env.local` file in `/frontend`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Note:** `NEXT_PUBLIC_*` variables are exposed to browser (safe for public URLs).

### 4. Start

Deploy

Frontend runs on: `http://localhost:3000`
