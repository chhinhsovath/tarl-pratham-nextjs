# Jenkins Setup Guide for TaRL Pratham

## Required Jenkins Credentials

### 1. Database Password Credential

You need to add the database password as a Jenkins credential:

1. **Go to Jenkins Dashboard**
2. **Navigate to**: Manage Jenkins → Manage Credentials
3. **Select**: Global credentials (unrestricted)
4. **Click**: Add Credentials
5. **Fill in the form**:
   - **Kind**: Secret text
   - **Scope**: Global
   - **Secret**: `P@ssw0rd` (your database password)
   - **ID**: `tarl-pratham-db-password`
   - **Description**: Database password for TaRL Pratham
6. **Click**: OK

### Alternative: Using Jenkins CLI

If you have Jenkins CLI access, you can create the credential using:

```bash
echo 'P@ssw0rd' | jenkins-cli create-credentials-by-xml system::system::jenkins _ <<EOF
<com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
  <scope>GLOBAL</scope>
  <id>tarl-pratham-db-password</id>
  <description>Database password for TaRL Pratham</description>
  <username>admin</username>
  <password>P@ssw0rd</password>
</com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
EOF
```

### Alternative: Environment Variable (Less Secure)

If you cannot access Jenkins credentials, you can modify the Jenkinsfile to use an environment variable:

```groovy
environment {
    DB_PASSWORD = 'P@ssw0rd'
}
```

**⚠️ Warning**: This is less secure as the password will be visible in the Jenkinsfile.

## Build Optimization Notes

### Current Build Performance
- **Build Time**: ~2 minutes 43 seconds
- **Build Size**: 1.1GB (can be optimized)
- **Memory Usage**: 3GB allocated
- **CPU Cores**: Limited to 2

### Large Build Size (.next folder = 1.1GB)

The `.next` folder is quite large. To reduce it:

1. **Check for unnecessary files in public folder**
2. **Review imported dependencies** (especially large ones like chart libraries)
3. **Enable standalone output** (already configured)
4. **Remove unused pages/components**

### Monitoring Build Performance

The build now outputs:
- Memory usage during build
- Build timing
- Final `.next` folder size

Watch these metrics to identify bottlenecks.

## Troubleshooting

### If Build Fails with "Out of Memory"
- Increase memory in Jenkinsfile: `export NODE_OPTIONS='--max-old-space-size=4096'`
- Reduce concurrent builds on Jenkins server
- Check server memory availability

### If Build Takes Too Long
- Current timeout: 20 minutes
- If consistently timing out, increase timeout
- Consider using incremental builds
- Review and optimize slow pages/components

### If Deployment Fails
1. Check Jenkins credential is configured correctly
2. Verify SSH access to deployment server
3. Check deployment server disk space
4. Review deployment server logs: `sudo journalctl -u tarl-pratham -n 50`

## Next Steps After Fixing Credentials

1. **Add the credential in Jenkins** (as described above)
2. **Trigger a new build** or wait for automatic trigger
3. **Monitor the deployment** through Jenkins console
4. **Verify the application** is running on port 3006
5. **Check health endpoint**: `http://157.10.73.82:3006`

## Contact

If you encounter issues:
- Check Jenkins logs
- Review deployment server logs
- Verify network connectivity
- Ensure all required services are running
