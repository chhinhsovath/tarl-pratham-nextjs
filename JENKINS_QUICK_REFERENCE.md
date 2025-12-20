# Jenkins CI/CD Quick Reference - TaRL Pratham

## 🚀 Quick Start

### Initial Setup (One-time)
```bash
# 1. Add SSH credentials to Jenkins
Jenkins → Manage Jenkins → Credentials → Add SSH key

# 2. Add database password to Jenkins
Jenkins → Credentials → Add Secret Text
ID: tarl-pratham-db-password
Secret: P@ssw0rd

# 3. Create pipeline job
Jenkins → New Item → Pipeline → tarl-pratham-deployment
Configure → Pipeline from SCM → Git
Repository: https://github.com/chhinhsovath/tarl-pratham-nextjs
Script Path: Jenkinsfile
```

### Deploy Application
```bash
# Via Jenkins UI
Jenkins → tarl-pratham-deployment → Build Now

# Via CLI
java -jar jenkins-cli.jar -s http://localhost:8080/ build tarl-pratham-deployment
```

---

## 📝 Common Commands

### On Jenkins Server
```bash
# Restart Jenkins
sudo systemctl restart jenkins

# View Jenkins logs
sudo journalctl -u jenkins -f

# Check Jenkins status
sudo systemctl status jenkins

# Test SSH to target server (as jenkins user)
sudo -u jenkins ssh ubuntu@157.10.73.82
```

### On Target Server (157.10.73.82)
```bash
# Check application status
sudo systemctl status tarl-pratham
# OR
pm2 list

# View logs
sudo journalctl -u tarl-pratham -f -n 100
# OR
pm2 logs tarl-pratham --lines 100

# Restart application
sudo systemctl restart tarl-pratham
# OR
pm2 restart tarl-pratham

# Manual deployment
cd /opt/tarl-pratham
sudo ./deploy.sh update
```

---

## 🔍 Troubleshooting

### Build Fails

**1. Check Jenkins Console Output**
```
Jenkins → Build #X → Console Output
```

**2. Common Errors**

| Error | Solution |
|-------|----------|
| `npm: command not found` | Install Node.js on Jenkins server |
| `Permission denied (publickey)` | Check SSH credentials in Jenkins |
| `Database connection error` | Verify DATABASE_URL in credentials |
| `Port 3006 already in use` | Kill existing process: `sudo lsof -i :3006` |

### Application Not Responding

```bash
# 1. Check if running
curl http://localhost:3006

# 2. Check logs
sudo journalctl -u tarl-pratham -n 50

# 3. Check process
ps aux | grep next

# 4. Check port
sudo netstat -tulpn | grep 3000

# 5. Restart
sudo systemctl restart tarl-pratham
```

---

## 🔧 File Locations

### Jenkins Server
```
/var/lib/jenkins/                    # Jenkins home
/var/lib/jenkins/.ssh/id_rsa        # SSH private key
/var/lib/jenkins/workspace/         # Build workspace
/var/log/jenkins/jenkins.log        # Jenkins logs
```

### Target Server
```
/opt/tarl-pratham/                  # Application directory
/opt/tarl-pratham/.env              # Environment variables
/etc/systemd/system/tarl-pratham.service  # Systemd service
/var/log/tarl-pratham.log          # Application logs
```

---

## 🎯 Deployment Workflow

```
1. Developer pushes code to GitHub
   ↓
2. Jenkins detects change (webhook/poll)
   ↓
3. Jenkins pulls latest code
   ↓
4. Install dependencies
   ↓
5. Generate Prisma client
   ↓
6. Build Next.js app
   ↓
7. Run tests (optional)
   ↓
8. Package application
   ↓
9. Copy to target server via SSH
   ↓
10. Extract and install on server
   ↓
11. Restart application
   ↓
12. Health check
   ↓
13. ✅ Deployment complete
```

---

## 📊 Health Checks

```bash
# Application
curl http://157.10.73.82:3006
curl http://157.10.73.82:3006/api/health

# Database
psql -h 157.10.73.82 -U admin -d tarl_pratham -c "SELECT 1"

# Jenkins
curl http://JENKINS_SERVER:8080

# System resources
free -h    # Memory
df -h      # Disk space
htop       # CPU/processes
```

---

## 🔄 Rollback

### Quick Rollback
```bash
# Method 1: Rebuild previous version in Jenkins
Jenkins → Build History → Previous Build → Rebuild

# Method 2: Manual rollback on server
ssh ubuntu@157.10.73.82
cd /opt/tarl-pratham
git log --oneline -5
git checkout <PREVIOUS_COMMIT>
npm install && npx prisma generate && npm run build
sudo systemctl restart tarl-pratham
```

---

## 📋 Credentials Reference

| Credential ID | Type | Purpose |
|--------------|------|---------|
| `tarl-pratham-server-ssh` | SSH Key | Deploy to server |
| `tarl-pratham-db-password` | Secret | Database access |
| `tarl-pratham-nextauth-secret` | Secret | NextAuth |

---

## 🔐 Security Checklist

- [ ] SSH key authentication enabled
- [ ] Database password stored in Jenkins credentials
- [ ] NEXTAUTH_SECRET set and rotated regularly
- [ ] Firewall enabled on target server
- [ ] SSL/TLS enabled (reverse proxy)
- [ ] Regular security updates (`npm audit`)
- [ ] Database backups scheduled

---

## 📞 Quick Links

- **Jenkins**: http://JENKINS_SERVER:8080
- **Application**: http://157.10.73.82:3006
- **GitHub**: https://github.com/chhinhsovath/tarl-pratham-nextjs
- **Full Guide**: [JENKINS_DEPLOYMENT_GUIDE.md](JENKINS_DEPLOYMENT_GUIDE.md)

---

**Version**: 1.0.0 | **Updated**: 2025-12-20
