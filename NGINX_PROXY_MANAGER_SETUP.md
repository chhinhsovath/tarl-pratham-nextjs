# Nginx Proxy Manager Configuration for TaRL Pratham

Complete guide to configure Nginx Proxy Manager for the TaRL Pratham Next.js application.

---

## 📋 Prerequisites

- Nginx Proxy Manager installed and running
- Domain pointing to your server (e.g., `tarl.openplp.com`)
- TaRL Pratham app running on `157.10.73.82:3006`
- Access to NPM admin panel at `http://157.10.73.82:81`

---

## 🔧 Step-by-Step Configuration

### Step 1: Create New Proxy Host

1. **Access Nginx Proxy Manager**
   ```
   URL: http://157.10.73.82:81
   Default credentials:
   Email: admin@example.com
   Password: changeme
   (Change on first login)
   ```

2. **Click "Hosts" → "Proxy Hosts" → "Add Proxy Host"**

---

### Step 2: Details Tab Configuration

Fill in the **Details** tab:

```
┌─────────────────────────────────────────────────────────┐
│ Domain Names                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ tarl.openplp.com                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Scheme:  ● http  ○ https                               │
│                                                         │
│ Forward Hostname / IP                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 127.0.0.1  (or 157.10.73.82)                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Forward Port                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3006                                                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ☐ Cache Assets                                          │
│ ☑ Block Common Exploits                                 │
│ ☑ Websockets Support (IMPORTANT for Next.js)            │
│                                                         │
│ Access List: Public                                     │
└─────────────────────────────────────────────────────────┘
```

**Key Settings:**
- **Domain Names**: `tarl.openplp.com` (your actual domain)
- **Scheme**: `http` (app runs on http internally)
- **Forward Hostname/IP**: `127.0.0.1` or `157.10.73.82`
- **Forward Port**: `3006`
- **✅ Block Common Exploits**: Enabled
- **✅ Websockets Support**: **MUST be enabled** for Next.js hot reload and real-time features

---

### Step 3: Custom Locations Tab (Optional)

For most Next.js apps, you **don't need custom locations**. The default `/` location handles everything.

**Only add custom locations if you need:**

#### Option A: API Rate Limiting
If you want to rate limit API calls:

```
Location: /api
Scheme: http
Forward Hostname/IP: 127.0.0.1
Forward Port: 3006
```

Then add in "Advanced" tab for this location:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req zone=api_limit burst=20;
```

#### Option B: Static Asset Caching
For better performance on static files:

```
Location: /_next/static
Scheme: http
Forward Hostname/IP: 127.0.0.1
Forward Port: 3006
```

Then add in "Advanced" tab:
```nginx
expires 1y;
add_header Cache-Control "public, immutable";
```

#### Option C: Large File Uploads
If you have file upload features:

```
Location: /api/upload
Scheme: http
Forward Hostname/IP: 127.0.0.1
Forward Port: 3006
```

Then add in "Advanced" tab:
```nginx
client_max_body_size 50M;
proxy_read_timeout 300s;
```

**⚠️ For Basic Setup: Skip Custom Locations**

---

### Step 4: SSL Tab Configuration

**Recommended: Free SSL with Let's Encrypt**

```
┌─────────────────────────────────────────────────────────┐
│ SSL Certificate                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● Request a new SSL Certificate                    │ │
│ │   with Let's Encrypt                                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ☑ Force SSL                                             │
│ ☑ HTTP/2 Support                                        │
│ ☐ HSTS Enabled                                          │
│ ☑ HSTS Subdomains                                       │
│                                                         │
│ Email Address for Let's Encrypt                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ chhinhs@gmail.com                                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ☑ I Agree to the Let's Encrypt Terms of Service        │
└─────────────────────────────────────────────────────────┘
```

**Key Settings:**
- **✅ Force SSL**: Redirect HTTP → HTTPS
- **✅ HTTP/2 Support**: Better performance
- **✅ I Agree to Let's Encrypt ToS**: Required for free SSL

**⚠️ Important:** Your domain DNS must point to `157.10.73.82` BEFORE requesting SSL

---

### Step 5: Advanced Tab (Next.js Optimization)

Click the **Advanced** tab and add this configuration:

```nginx
# Next.js specific optimizations
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;

# Real IP forwarding
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header X-Forwarded-Port $server_port;

# Timeouts for long-running requests
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;

# Buffer settings
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
proxy_busy_buffers_size 8k;

# File upload size (adjust as needed)
client_max_body_size 10M;

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# Hide Nginx version
server_tokens off;
```

---

## ✅ Complete Configuration Example

### Basic Setup (Recommended for Most Users)

**Details Tab:**
- Domain: `tarl.openplp.com`
- Forward: `127.0.0.1:3006`
- ✅ Block Common Exploits
- ✅ Websockets Support

**SSL Tab:**
- ✅ Request new SSL (Let's Encrypt)
- ✅ Force SSL
- ✅ HTTP/2 Support

**Advanced Tab:**
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

**Custom Locations:** *(Leave empty for basic setup)*

---

## 🚀 Testing Your Configuration

### 1. Test HTTP Access (Before SSL)
```bash
curl http://tarl.openplp.com
# Should return HTML from your Next.js app
```

### 2. Test HTTPS Access (After SSL)
```bash
curl https://tarl.openplp.com
# Should return HTML with valid SSL
```

### 3. Test SSL Certificate
```bash
openssl s_client -connect tarl.openplp.com:443 -servername tarl.openplp.com
# Should show Let's Encrypt certificate
```

### 4. Browser Test
```
Open: https://tarl.openplp.com
Check:
- ✅ Green padlock (valid SSL)
- ✅ Login page loads
- ✅ No mixed content warnings
- ✅ API calls work (check Network tab)
```

---

## 🔧 Advanced Configurations

### Configuration A: Rate Limiting for API

**Custom Location:** `/api`

**Advanced:**
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req zone=api_limit burst=20 nodelay;

# API-specific headers
proxy_set_header X-API-Request "true";
```

---

### Configuration B: Static Asset Optimization

**Custom Location:** `/_next/static`

**Advanced:**
```nginx
# Long-term caching for Next.js static files
expires 365d;
add_header Cache-Control "public, max-age=31536000, immutable";
access_log off;
```

---

### Configuration C: Large File Uploads

**Custom Location:** `/api/upload`

**Advanced:**
```nginx
# Allow large uploads
client_max_body_size 100M;
client_body_buffer_size 1M;

# Extended timeouts for uploads
proxy_connect_timeout 600s;
proxy_send_timeout 600s;
proxy_read_timeout 600s;
send_timeout 600s;

# Progress support
proxy_request_buffering off;
```

---

### Configuration D: WebSocket Support (for Real-time Features)

**Custom Location:** `/socket.io`

**Advanced:**
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;

# WebSocket timeouts
proxy_read_timeout 3600s;
proxy_send_timeout 3600s;
```

---

## 🐛 Troubleshooting

### Issue 1: "502 Bad Gateway"

**Cause:** App not running or wrong port

**Solution:**
```bash
# Check if app is running
curl http://localhost:3006

# Check systemd status
sudo systemctl status tarl-pratham

# Check PM2 status
pm2 list

# Restart if needed
sudo systemctl restart tarl-pratham
# OR
pm2 restart tarl-pratham
```

---

### Issue 2: SSL Certificate Fails

**Cause:** DNS not pointing to server or port 80/443 blocked

**Solution:**
```bash
# Check DNS
dig tarl.openplp.com
# Should return 157.10.73.82

# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check if ports are listening
sudo netstat -tulpn | grep -E ':(80|443)'
```

---

### Issue 3: Slow Loading

**Cause:** No caching or buffering

**Solution:** Add to Advanced tab:
```nginx
# Enable buffering
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;

# Enable compression
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript
           application/json application/javascript application/xml+rss;
```

---

### Issue 4: WebSocket Connection Fails

**Cause:** Websockets Support not enabled

**Solution:**
1. Go to Proxy Host → Edit
2. Details tab → ✅ Enable "Websockets Support"
3. Save

---

### Issue 5: API Calls Return 413 (Payload Too Large)

**Cause:** File upload size limit

**Solution:** Add to Advanced tab:
```nginx
client_max_body_size 50M;
```

---

## 📊 Health Check & Monitoring

### Check Nginx Proxy Manager Logs
```bash
# Access container logs (if using Docker)
docker logs nginx-proxy-manager

# Check Nginx error logs
docker exec nginx-proxy-manager cat /var/log/nginx/error.log
```

### Check Application Health via Proxy
```bash
# Test health endpoint through proxy
curl https://tarl.openplp.com/api/health

# Should return application status
```

### Monitor SSL Certificate Expiry
```bash
# Check certificate expiry
echo | openssl s_client -servername tarl.openplp.com \
  -connect tarl.openplp.com:443 2>/dev/null | \
  openssl x509 -noout -dates
```

---

## 🔒 Security Best Practices

### 1. Enable Security Headers
Add to Advanced tab:
```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### 2. Disable Server Tokens
```nginx
server_tokens off;
more_clear_headers Server;
```

### 3. Rate Limiting
```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req zone=general burst=20;
```

### 4. Block Bad Bots
```nginx
if ($http_user_agent ~* (bot|crawler|spider|scraper)) {
    return 403;
}
```

---

## 📝 Configuration Checklist

Before going live, verify:

- [ ] Domain DNS points to `157.10.73.82`
- [ ] Application running on port `3006`
- [ ] Firewall allows ports 80, 443
- [ ] Proxy Host created with correct domain
- [ ] Forward port set to `3006`
- [ ] ✅ Websockets Support enabled
- [ ] ✅ Block Common Exploits enabled
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] ✅ Force SSL enabled
- [ ] Advanced config added (proxy headers)
- [ ] Tested HTTP → HTTPS redirect
- [ ] Tested login functionality
- [ ] Tested API endpoints
- [ ] Tested file uploads (if applicable)
- [ ] Security headers configured
- [ ] Rate limiting configured (optional)

---

## 🔗 Quick Reference

| Setting | Value |
|---------|-------|
| **NPM Admin URL** | http://157.10.73.82:81 |
| **Domain** | tarl.openplp.com |
| **Forward Host** | 127.0.0.1 or 157.10.73.82 |
| **Forward Port** | 3006 |
| **SSL Provider** | Let's Encrypt |
| **Protocol** | HTTP/2 with SSL |
| **Websockets** | Enabled |

---

## 📞 Support

- **Nginx Proxy Manager Docs**: https://nginxproxymanager.com/guide/
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Last Updated**: 2025-12-20
**Version**: 1.0.0
**Project**: TaRL Pratham Next.js
