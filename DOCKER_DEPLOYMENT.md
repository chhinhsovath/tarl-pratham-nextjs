# Docker Deployment Guide for TaRL Pratham

## Overview

TaRL Pratham now runs in Docker for better isolation, resource management, and consistency with your other services (Jenkins, Nginx Proxy Manager).

## Architecture

```
┌─────────────────────────────────────────────┐
│  Server: 10.1.73.82 (Internal)              │
│         157.10.73.82 (External)             │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Docker Containers                   │  │
│  │                                      │  │
│  │  ┌────────────────┐                 │  │
│  │  │ Jenkins        │                 │  │
│  │  │ Port: 8080     │                 │  │
│  │  └────────────────┘                 │  │
│  │                                      │  │
│  │  ┌────────────────┐                 │  │
│  │  │ Nginx Proxy    │                 │  │
│  │  │ Manager        │                 │  │
│  │  │ Ports: 80,443  │                 │  │
│  │  └────────────────┘                 │  │
│  │                                      │  │
│  │  ┌────────────────┐                 │  │
│  │  │ TaRL Pratham   │ ← NEW!          │  │
│  │  │ Port: 3006     │                 │  │
│  │  └────────────────┘                 │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Benefits of Docker Deployment

### 1. **Better Resource Management**
   - Memory limits: 1GB max, 512MB reserved
   - CPU limits: 1 core max
   - Prevents app from consuming all server resources

### 2. **Isolation**
   - App runs in its own container
   - Doesn't interfere with other services
   - Clean separation of concerns

### 3. **Consistency**
   - Same environment every time
   - Matches Jenkins and NPM architecture
   - Easy rollback (just restart old image)

### 4. **Better Logging**
   - Centralized Docker logs
   - Log rotation (max 10MB, 3 files)
   - Easy to view: `docker logs tarl-pratham`

## Deployment Options

### Option 1: Use Jenkinsfile.docker (Recommended)

**Steps:**
1. Rename current `Jenkinsfile` to `Jenkinsfile.systemd` (backup)
2. Rename `Jenkinsfile.docker` to `Jenkinsfile`
3. Commit and push
4. Jenkins will auto-build and deploy with Docker

**Commands:**
```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs
mv Jenkinsfile Jenkinsfile.systemd
mv Jenkinsfile.docker Jenkinsfile
git add Jenkinsfile Jenkinsfile.systemd Jenkinsfile.docker
git commit -m "Switch to Docker deployment"
git push origin main
```

### Option 2: Manual Docker Deployment

**On your server:**
```bash
ssh ubuntu@10.1.73.82

# Stop systemd service if running
sudo systemctl stop tarl-pratham
sudo systemctl disable tarl-pratham

# Build Docker image (if not using Jenkins)
cd /opt/tarl-pratham
docker build -t tarl-pratham:latest .

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable"
NEXTAUTH_URL="https://tarl.sovathc.org"
NEXTAUTH_SECRET="5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0="
NODE_ENV="production"
PORT="3006"
EOF

# Run container
docker run -d \
    --name tarl-pratham \
    --restart unless-stopped \
    -p 10.1.73.82:3006:3006 \
    --env-file .env \
    --memory 1024m \
    --cpus 1.0 \
    tarl-pratham:latest

# Check status
docker ps | grep tarl-pratham
docker logs tarl-pratham --tail 20
```

## Docker Commands Reference

### View Logs:
```bash
docker logs tarl-pratham                    # All logs
docker logs tarl-pratham --tail 50         # Last 50 lines
docker logs tarl-pratham -f                # Follow (live)
```

### Restart Container:
```bash
docker restart tarl-pratham
```

### Stop/Start:
```bash
docker stop tarl-pratham
docker start tarl-pratham
```

### Remove Container:
```bash
docker stop tarl-pratham
docker rm tarl-pratham
```

### View Resource Usage:
```bash
docker stats tarl-pratham
```

### Access Container Shell:
```bash
docker exec -it tarl-pratham sh
```

## Resource Configuration

**Memory Limits:**
- Maximum: 1GB (prevents consuming all server RAM)
- Reserved: 512MB (guaranteed minimum)
- **Important**: Server only has 1.8GB total RAM

**CPU Limits:**
- Maximum: 1 core
- Reserved: 0.5 cores
- **Important**: Prevents app from starving other services

## Troubleshooting

### Issue: Container won't start
**Check logs:**
```bash
docker logs tarl-pratham
```

**Common causes:**
- Database connection failed (check .env)
- Port already in use
- Memory limit too low

### Issue: Out of memory
**Check resource usage:**
```bash
docker stats tarl-pratham
```

**Solution:**
- Increase memory limit in docker run command
- Or use docker-compose and update resources

### Issue: NPM can't reach app
**Verify network binding:**
```bash
docker exec tarl-pratham netstat -tlnp | grep 3006
```

**Should show:**
```
0.0.0.0:3006  ✅ Accessible from NPM
```

### Issue: Database connection failed
**Check database connectivity:**
```bash
docker exec tarl-pratham ping -c 3 157.10.73.82
```

## Nginx Proxy Manager Configuration

Your NPM configuration should be:
- **Domain**: tarl.sovathc.org
- **Scheme**: http
- **Forward Hostname/IP**: `10.1.73.82`
- **Forward Port**: `3006`
- **Websockets**: ON
- **Block Common Exploits**: ON

## Comparison: Systemd vs Docker

| Aspect | Systemd (Old) | Docker (New) |
|--------|---------------|--------------|
| Resource Control | Limited | Excellent |
| Isolation | None | Complete |
| Rollback | Manual | Easy (image tags) |
| Logs | journalctl | docker logs |
| Updates | Replace files | Replace container |
| Memory Limit | No | Yes (1GB) |
| CPU Limit | No | Yes (1 core) |

## Next Steps

1. **Choose deployment method** (Option 1 or 2 above)
2. **Deploy the Docker version**
3. **Verify it's running**: `docker ps | grep tarl-pratham`
4. **Test access**: `curl http://10.1.73.82:3006`
5. **Configure NPM** (if not already)
6. **Test public URL**: `https://tarl.sovathc.org`

## Benefits for Your 1.8GB RAM Server

Docker deployment is **especially beneficial** for your limited RAM:
- **Memory limits prevent crashes** (app can't consume all RAM)
- **CPU limits prevent freezing** (app can't starve other services)
- **Automatic restarts** if app crashes
- **Better resource sharing** with Jenkins and NPM

The long build times will remain due to server specs, but the **runtime will be more stable and reliable** with Docker!
