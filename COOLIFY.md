# Coolify Monorepo Deploy Setup

## Step 1: Turn off Auto Deploy in Coolify

For **both** Next.js and Strapi services:

- Go to **Advanced** tab → uncheck **"Auto Deploy"**

---

## Step 2: Get UUIDs from Coolify

For each service, go to **Webhooks** tab and copy the Deploy Webhook URL:

```bash
https://coolify.tiktokrecorder.com/api/v1/deploy?uuid=u4ui23hiu23iuh32&force=false
```

---

## Step 3: Create API Token in Coolify

1. Go to **Settings** → **API Tokens**
2. Click **Create** → name it `github-deploy`
3. Copy the token

---

## Step 4: Add GitHub Secrets

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Name                       | Value                      |
| -------------------------- | -------------------------- |
| `COOLIFY_TOKEN`            | Your API token from Step 3 |
| `COOLIFY_FRONTEND_WEBHOOK` | URL for Next.js service    |
| `COOLIFY_BACKEND_WEBHOOK`  | URL for Strapi service     |

---

## Done!

Now when you push to `main`:

- Changes in `frontend/**` → only Next.js deploys
- Changes in `backend/**` → only Strapi deploys
