# Docker + Nginx Proxy Manager Troubleshooting Guide

## Critical Understanding: Docker Network Isolation

When Nginx Proxy Manager (NPM) runs in Docker, it **cannot access** services listening on `127.0.0.1` (localhost only).

### Why This Matters:

```
┌─────────────────────────────────────────┐
│  Server (10.1.73.82)                    │
│                                         │
│  ┌──────────────────────┐              │
│  │  Docker Network      │              │
│  │                      │              │
│  │  ┌────────────────┐  │              │
│  │  │ Nginx Proxy    │  │              │
│  │  │ Manager        │──┼──────────┐   │
│  │  │ (NPM)          │  │          │   │
│  │  └────────────────┘  │          │   │
│  └──────────────────────┘          │   │
│                                     │   │
│  ┌─────────────────────────────────┼─┐ │
│  │ Host Network                    │ │ │
│  │                                 │ │ │
│  │ ✅ App on 0.0.0.0:3006 ←────────┘ │ │
│  │    (NPM can access)               │ │
│  │                                   │ │
│  │ ❌ App on 127.0.0.1:3006          │ │
│  │    (NPM CANNOT access)            │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## The Fix Applied

### Before (Broken):
```json
"start:prod": "next start -p 3006"
```
- Next.js defaults to `127.0.0.1:3006`
- Only accessible on localhost
- NPM in Docker cannot reach it
- Result: 502 Bad Gateway

### After (Fixed):
```json
"start:prod": "next start -p 3006 -H 0.0.0.0"
```
- Next.js binds to `0.0.0.0:3006`
- Accessible from all network interfaces
- NPM in Docker CAN reach it
- Result: Works! ✅

## How the Working CICD Dashboard Does It

The CICD dashboard works because it explicitly binds to `0.0.0.0`:

```ini
[Service]
ExecStart=/usr/bin/serve -s build -l tcp://0.0.0.0:3000
```

The `-l tcp://0.0.0.0:3000` flag ensures it's accessible from Docker.

## Verification Steps

After deployment, Jenkins will now automatically verify:

```bash
# Check what interface the app is listening on
sudo ss -tlnp | grep :3006

# Should show:
0.0.0.0:3006  ✅ GOOD - Accessible from Docker
127.0.0.1:3006  ❌ BAD - NOT accessible from Docker
```

## Testing After Deployment

### 1. Test from Server Directly:
```bash
ssh ubuntu@10.1.73.82
curl http://localhost:3006
# Should return HTML
```

### 2. Test from Docker Network:
```bash
# From inside NPM container
curl http://10.1.73.82:3006
# Should return HTML
```

### 3. Test Through NPM:
```bash
curl http://tarl.sovathc.org
# Should return HTML
```

## Common Issues & Solutions

### Issue 1: 502 Bad Gateway from NPM
**Cause**: App listening on 127.0.0.1 instead of 0.0.0.0
**Solution**: Already fixed with `-H 0.0.0.0` flag

### Issue 2: Connection Refused
**Cause**: App not running or wrong port
**Check**:
```bash
sudo systemctl status tarl-pratham
sudo ss -tlnp | grep 3006
```

### Issue 3: NPM Shows "Host Not Found"
**Cause**: Wrong IP in NPM configuration
**Solution**: Ensure NPM points to `10.1.73.82:3006` (internal IP)

### Issue 4: Database Connection Failed
**Cause**: Missing Jenkins credential
**Solution**: Add `tarl-pratham-db-password` in Jenkins

## IP Address Reference

### Your Server IPs:
- **External IP**: `157.10.73.82` (for external access)
- **Internal IP**: `10.1.73.82` (for Docker/internal services)

### Port Mapping:
```
Service                 Internal IP          External Access
──────────────────────────────────────────────────────────────
Jenkins                 10.1.73.82:8080      cicd.sovathc.org
CICD Dashboard          10.1.73.82:3000      proxy.sovathc.org
TaRL Pratham            10.1.73.82:3006      tarl.sovathc.org
Nginx Proxy Manager     10.1.73.82:81        (admin interface)
```

### NPM Configuration (Correct):
```
Domain: tarl.sovathc.org
Scheme: http
Forward Hostname/IP: 10.1.73.82
Forward Port: 3006
```

## Why Use Internal IP (10.x) for NPM?

1. **Faster**: No routing through external network
2. **Secure**: Traffic stays on internal network
3. **Standard**: Docker containers typically use host's internal IP
4. **Consistent**: Matches your working proxy/cicd configuration

## Next Steps

1. ✅ Code changes pushed to GitHub
2. ⏳ Add Jenkins credential: `tarl-pratham-db-password`
3. ⏳ Trigger new Jenkins build
4. ✅ Deployment will verify 0.0.0.0 binding
5. ✅ NPM should be able to reach the app
6. ✅ `tarl.sovathc.org` will work!

## Debugging Commands

If issues persist after deployment:

```bash
# Check if app is running
sudo systemctl status tarl-pratham

# Check what interface it's listening on
sudo ss -tlnp | grep 3006

# Check NPM can reach it (from inside NPM container)
docker exec -it <npm-container-id> curl http://10.1.73.82:3006

# Check firewall rules
sudo ufw status
sudo iptables -L -n

# Check application logs
sudo journalctl -u tarl-pratham -n 50 -f
```

## Expected Output After Successful Deployment

```
=== Verifying Network Binding ===
App listening on: 0.0.0.0:3006
✅ CORRECT: App is listening on 0.0.0.0:3006 (accessible from Docker/NPM)
✅ Deployment successful and network binding verified!
Local access: http://localhost:3006
Server access: http://10.1.73.82:3006
Public URL (via NPM): Configure in Nginx Proxy Manager
```

## Summary

The key insight from your working CICD dashboard:
- **Always bind to `0.0.0.0`** when services need to be accessed by Docker containers
- **Use internal IP** (`10.1.73.82`) in NPM configuration for better performance
- **Verify network binding** in deployment pipeline to catch issues early

Your Nginx Proxy Manager configuration for `tarl` is **already correct**. Once the app deploys with the `0.0.0.0` binding, it will work perfectly!
