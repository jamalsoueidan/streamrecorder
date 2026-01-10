# 🚀 N8N

## Kill n8n worker the right way, so you do not loss any recording

```bash
docker ps #List running containers:
docker stop -t 2100 <container_id>   # Wait up to 35 minutes
nohup docker stop -t 2100 <container_id> > /dev/null 2>&1 & #run in backend
```
