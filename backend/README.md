# 🚀 Strapi

## Run production DB locally

```bash
pg_dump -h IP_ADDRESS -p 32768 -U postgres -d strapi > backup.sql
psql -U postgres -c "DROP DATABASE IF EXISTS strapi;"
psql -U postgres -c "CREATE DATABASE strapi;"
psql -U postgres -d strapi < backup.sql
```

# test
