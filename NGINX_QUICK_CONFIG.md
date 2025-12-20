# Nginx Proxy Manager - Quick Configuration

## 🚀 5-Minute Setup

### Tab 1: Details

```
Domain Names:
┌────────────────────────────┐
│ tarl.openplp.com           │
└────────────────────────────┘

Scheme:  ● http  ○ https

Forward Hostname / IP:
┌────────────────────────────┐
│ 127.0.0.1                  │  ← Use localhost (same server)
└────────────────────────────┘

Forward Port:
┌────────────────────────────┐
│ 3006                       │  ← Your app port
└────────────────────────────┘

☐ Cache Assets
☑ Block Common Exploits        ← ENABLE THIS
☑ Websockets Support           ← ENABLE THIS (CRITICAL for Next.js)
```

---

### Tab 2: Custom Locations

**For basic setup: SKIP THIS TAB**

Leave empty unless you need specific routing.

---

### Tab 3: SSL

```
SSL Certificate:
● Request a new SSL Certificate with Let's Encrypt

☑ Force SSL                    ← Redirect HTTP to HTTPS
☑ HTTP/2 Support               ← Better performance
☐ HSTS Enabled                 ← Optional (for extra security)
☑ HSTS Subdomains              ← Only if using subdomains

Email for Let's Encrypt:
┌────────────────────────────┐
│ chhinhs@gmail.com          │
└────────────────────────────┘

☑ I Agree to the Let's Encrypt Terms of Service
```

---

### Tab 4: Advanced (Optional but Recommended)

Copy-paste this:

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

---

## ✅ Then Click "Save"

---

## 🧪 Test It

```bash
# Test HTTP (should redirect to HTTPS if Force SSL enabled)
curl -I http://tarl.openplp.com

# Test HTTPS
curl -I https://tarl.openplp.com

# Open in browser
https://tarl.openplp.com
```

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| 502 Bad Gateway | Check if app is running: `pm2 list` or `systemctl status tarl-pratham` |
| SSL fails | Ensure DNS points to 157.10.73.82 and ports 80/443 are open |
| Slow loading | Add buffering config to Advanced tab |
| WebSocket errors | Enable "Websockets Support" in Details tab |

---

**That's it! Your Next.js app is now proxied with SSL.** 🎉
