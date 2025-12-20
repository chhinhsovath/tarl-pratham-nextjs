# Jenkins CI/CD Deployment Guide for TaRL Pratham Next.js

This guide provides step-by-step instructions to set up Jenkins for automated deployment of the TaRL Pratham Next.js application.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Jenkins Server Setup](#jenkins-server-setup)
- [Jenkins Configuration](#jenkins-configuration)
- [Pipeline Setup](#pipeline-setup)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
- [Monitoring & Troubleshooting](#monitoring--troubleshooting)
- [Security Best Practices](#security-best-practices)

---

## 🔧 Prerequisites

### Server Requirements
- **Jenkins Server**: Running Jenkins 2.x or higher
- **Target Server**: 157.10.73.82 (Ubuntu/Debian)
- **Database Server**: PostgreSQL on 157.10.73.82:5432
- **Node.js**: Version 18 or higher
- **Git**: For repository access

### Required Jenkins Plugins
1. **NodeJS Plugin** - For Node.js environment management
2. **Git Plugin** - For repository checkout
3. **SSH Plugin** - For remote server deployment
4. **Pipeline Plugin** - For pipeline execution
5. **Credentials Binding Plugin** - For secure credential management

Install plugins via: `Manage Jenkins` → `Manage Plugins` → `Available`

---

## 🖥️ Jenkins Server Setup

### 1. Install Jenkins (if not already installed)

On Ubuntu/Debian:
```bash
# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Install Jenkins
sudo apt-get update
sudo apt-get install -y jenkins openjdk-11-jdk

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Check status
sudo systemctl status jenkins
```

Jenkins will be available at: `http://YOUR_SERVER_IP:8080`

### 2. Initial Jenkins Configuration

```bash
# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Access Jenkins web interface and complete setup wizard
# Install suggested plugins
```

### 3. Install Node.js on Jenkins Server

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## 🔐 Jenkins Configuration

### 1. Configure SSH Credentials for Target Server

**Step 1: Generate SSH key (if needed)**
```bash
# On Jenkins server
sudo -u jenkins ssh-keygen -t rsa -b 4096 -C "jenkins@tarl-pratham"
# Save to: /var/lib/jenkins/.ssh/id_rsa
# No passphrase (press Enter twice)
```

**Step 2: Copy public key to target server**
```bash
# Copy the public key
sudo cat /var/lib/jenkins/.ssh/id_rsa.pub

# On target server (157.10.73.82), add to authorized_keys
echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Step 3: Test SSH connection**
```bash
# On Jenkins server
sudo -u jenkins ssh ubuntu@157.10.73.82
# Type 'yes' to accept fingerprint, then exit
```

**Step 4: Add SSH credentials in Jenkins**
1. Go to `Manage Jenkins` → `Manage Credentials`
2. Click `System` → `Global credentials` → `Add Credentials`
3. Select `SSH Username with private key`
4. Fill in:
   - **ID**: `tarl-pratham-server-ssh`
   - **Description**: `SSH access to TaRL Pratham server`
   - **Username**: `ubuntu`
   - **Private Key**: Select "Enter directly" and paste contents of `/var/lib/jenkins/.ssh/id_rsa`
5. Click `OK`

### 2. Configure Database Password Credential

1. Go to `Manage Jenkins` → `Manage Credentials`
2. Click `System` → `Global credentials` → `Add Credentials`
3. Select `Secret text`
4. Fill in:
   - **Secret**: `P@ssw0rd` (your database password)
   - **ID**: `tarl-pratham-db-password`
   - **Description**: `TaRL Pratham database password`
5. Click `OK`

### 3. Configure NextAuth Secret Credential

1. Generate a secret:
   ```bash
   openssl rand -base64 32
   ```
2. Add to Jenkins credentials:
   - **Secret**: (paste generated secret)
   - **ID**: `tarl-pratham-nextauth-secret`
   - **Description**: `TaRL Pratham NextAuth secret`

---

## 🚀 Pipeline Setup

### 1. Create New Pipeline Job

1. In Jenkins, click `New Item`
2. Enter name: `tarl-pratham-deployment`
3. Select `Pipeline`
4. Click `OK`

### 2. Configure Pipeline

#### General Settings
- **Description**: `Automated deployment for TaRL Pratham Next.js application`
- **Discard old builds**: Keep last 10 builds

#### Build Triggers (Optional)
- ✅ **GitHub hook trigger for GITScm polling** (for automatic builds on push)
- ✅ **Poll SCM**: `H/5 * * * *` (check every 5 minutes)

#### Pipeline Configuration

**Option A: Pipeline from SCM (Recommended)**
1. Select `Pipeline script from SCM`
2. **SCM**: Git
3. **Repository URL**: `https://github.com/chhinhsovath/tarl-pratham-nextjs.git`
4. **Credentials**: Add GitHub credentials if private repository
5. **Branch**: `*/main`
6. **Script Path**: `Jenkinsfile`

**Option B: Pipeline Script**
1. Select `Pipeline script`
2. Copy and paste contents of `Jenkinsfile` from repository

### 3. Save and Build

1. Click `Save`
2. Click `Build Now` to test the pipeline
3. Monitor the build progress in `Console Output`

---

## 🌐 Environment Variables

The Jenkinsfile uses these environment variables. Update them in the Jenkinsfile if needed:

```groovy
environment {
    APP_NAME = 'tarl-pratham'
    APP_DIR = '/opt/tarl-pratham'
    SERVER_HOST = '157.10.73.82'
    SERVER_USER = 'ubuntu'
    NODE_VERSION = '18'
    PORT = '3000'
    DB_HOST = '157.10.73.82'
    DB_PORT = '5432'
    DB_NAME = 'tarl_pratham'
    DB_USER = 'admin'
}
```

---

## 📦 Deployment Options

### Option 1: Traditional Deployment (Default)

Uses systemd service for process management.

**Features:**
- ✅ Automatic restart on failure
- ✅ System integration
- ✅ Resource management
- ✅ Logging via journald

**Verify deployment:**
```bash
sudo systemctl status tarl-pratham
sudo journalctl -u tarl-pratham -f
```

### Option 2: PM2 Deployment

If PM2 is already installed on the target server.

**Features:**
- ✅ Process monitoring
- ✅ Zero-downtime restarts
- ✅ Built-in load balancer
- ✅ Log management

**Install PM2:**
```bash
sudo npm install -g pm2
pm2 startup systemd
```

**Verify deployment:**
```bash
pm2 list
pm2 logs tarl-pratham
pm2 monit
```

### Option 3: Docker Deployment (Advanced)

For containerized deployment using the provided Dockerfile.

**Prerequisites:**
```bash
# Install Docker on target server
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

**Build and run:**
```bash
cd /opt/tarl-pratham
docker build -t tarl-pratham:latest .
docker run -d \
  --name tarl-pratham \
  -p 3000:3006 \
  --env-file .env \
  --restart unless-stopped \
  tarl-pratham:latest
```

---

## 🔍 Monitoring & Troubleshooting

### Pipeline Monitoring

**View Build History:**
1. Go to pipeline job
2. Click on build number
3. View `Console Output` for detailed logs

**Build Status:**
- ✅ **Blue ball**: Success
- ⚠️ **Yellow ball**: Unstable (tests failed but build succeeded)
- ❌ **Red ball**: Failure

### Application Health Checks

**1. Check if application is running:**
```bash
curl http://157.10.73.82:3006
curl http://157.10.73.82:3006/api/health
```

**2. Check logs:**

**Systemd:**
```bash
sudo journalctl -u tarl-pratham -f -n 100
```

**PM2:**
```bash
pm2 logs tarl-pratham --lines 100
pm2 monit
```

**3. Check database connection:**
```bash
psql -h 157.10.73.82 -U admin -d tarl_pratham -c "SELECT 1"
```

### Common Issues

#### Issue 1: Build fails at "Install Dependencies" stage
**Cause:** Node.js or npm not available on Jenkins server

**Solution:**
```bash
# Install Node.js on Jenkins server
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Issue 2: SSH connection fails
**Cause:** Jenkins cannot SSH to target server

**Solution:**
```bash
# Test SSH manually
sudo -u jenkins ssh ubuntu@157.10.73.82

# If fails, check:
# 1. SSH key is in /var/lib/jenkins/.ssh/id_rsa
# 2. Public key is in target server's ~/.ssh/authorized_keys
# 3. SSH service is running on target server
```

#### Issue 3: Prisma client generation fails
**Cause:** Database connection string is incorrect

**Solution:**
```bash
# Verify DATABASE_URL in .env file on target server
cat /opt/tarl-pratham/.env | grep DATABASE_URL

# Test database connection
psql -h 157.10.73.82 -U admin -d tarl_pratham
```

#### Issue 4: Application doesn't start after deployment
**Cause:** Port 3006 is already in use

**Solution:**
```bash
# Check what's using port 3006
sudo lsof -i :3006

# Kill the process if needed
sudo kill -9 <PID>

# Restart application
sudo systemctl restart tarl-pratham
# OR
pm2 restart tarl-pratham
```

#### Issue 5: Health check fails
**Cause:** Application takes longer to start than expected

**Solution:**
- Increase sleep time in health check stage (currently 10 seconds)
- Check application logs for startup errors
- Verify all environment variables are set correctly

---

## 🔒 Security Best Practices

### 1. Credential Management
- ✅ Store all sensitive data in Jenkins credentials
- ✅ Never commit `.env` files to git
- ✅ Use SSH key authentication (not passwords)
- ✅ Rotate credentials regularly

### 2. Server Security
- ✅ Use dedicated deployment user with minimal permissions
- ✅ Enable firewall (UFW):
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 3000/tcp
  sudo ufw enable
  ```
- ✅ Keep system updated:
  ```bash
  sudo apt-get update && sudo apt-get upgrade -y
  ```

### 3. Application Security
- ✅ Use HTTPS in production (configure reverse proxy)
- ✅ Set strong `NEXTAUTH_SECRET`
- ✅ Implement rate limiting for API routes
- ✅ Regular security updates:
  ```bash
  npm audit
  npm audit fix
  ```

### 4. Database Security
- ✅ Use strong database passwords
- ✅ Restrict database access to specific IPs
- ✅ Regular database backups:
  ```bash
  # Add to crontab
  0 2 * * * /opt/tarl-pratham/scripts/backup-db.sh
  ```

---

## 📊 Pipeline Stages Explained

### 1. Verify Node.js
Checks that Node.js and npm are available on Jenkins server.

### 2. Install Dependencies
Installs all npm packages required for the build.

### 3. Generate Prisma Client
Generates Prisma client for database operations.

### 4. Build Application
Compiles Next.js application for production with memory optimization.

### 5. Run Tests
Executes Playwright tests (if configured). Build continues even if tests fail (marked as unstable).

### 6. Deploy to Server
- Creates deployment package (tar.gz)
- Copies to target server
- Extracts files
- Installs production dependencies
- Creates `.env` file with credentials
- Starts application using PM2 or systemd

### 7. Database Migration
Runs only if `prisma/schema.prisma` changed in the current commit.
Uses `prisma db push` to update database schema.

### 8. Health Check
Verifies the application is running and responding to HTTP requests.
Retries up to 5 times with 5-second intervals.

---

## 🔄 Rollback Procedure

If a deployment fails or introduces bugs:

**Method 1: Via Jenkins (Recommended)**
1. Go to previous successful build
2. Click `Rebuild`
3. This will deploy the previous version

**Method 2: Manual Rollback**
```bash
# SSH to target server
ssh ubuntu@157.10.73.82

cd /opt/tarl-pratham

# View recent commits
git log --oneline -10

# Checkout previous commit
git checkout <PREVIOUS_COMMIT_HASH>

# Rebuild and restart
npm install
npx prisma generate
npm run build
sudo systemctl restart tarl-pratham
```

**Method 3: Using Deployment Script**
```bash
ssh ubuntu@157.10.73.82
cd /opt/tarl-pratham

# Stop application
sudo ./deploy.sh stop

# Rollback code
git reset --hard <PREVIOUS_COMMIT_HASH>

# Update
sudo ./deploy.sh update
```

---

## 📞 Support & Resources

### Documentation
- **Project README**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Project CLAUDE.md**: [CLAUDE.md](CLAUDE.md)

### Useful Commands
```bash
# View Jenkins logs
sudo journalctl -u jenkins -f

# Restart Jenkins
sudo systemctl restart jenkins

# View application logs
sudo journalctl -u tarl-pratham -f

# Check disk space
df -h

# Check memory usage
free -h

# Monitor system resources
htop
```

### Contact
- **Repository**: https://github.com/chhinhsovath/tarl-pratham-nextjs
- **Issues**: https://github.com/chhinhsovath/tarl-pratham-nextjs/issues

---

## ✅ Post-Deployment Checklist

After successful deployment, verify:

- [ ] Application accessible at http://157.10.73.82:3006
- [ ] Login functionality works
- [ ] Database connection is active
- [ ] Student management features work
- [ ] Assessment features work
- [ ] Dashboard displays real data
- [ ] No errors in logs
- [ ] Health check endpoint responds: http://157.10.73.82:3006/api/health

---

**Last Updated**: 2025-12-20
**Version**: 1.0.0
**Author**: TaRL Pratham Development Team
