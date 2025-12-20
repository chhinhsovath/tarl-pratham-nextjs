pipeline {
    agent any

    environment {
        APP_NAME = 'tarl-pratham'
        APP_DIR = '/opt/tarl-pratham'
        SERVER_HOST = '157.10.73.82'
        SERVER_USER = 'ubuntu'
        NODE_VERSION = '18'
        PORT = '3006'
        // Database configuration
        DB_HOST = '157.10.73.82'
        DB_PORT = '5432'
        DB_NAME = 'tarl_pratham'
        DB_USER = 'admin'
    }

    stages {
        stage('Verify Node.js') {
            steps {
                sh '''
                    echo "Node.js version:"
                    node --version
                    echo "npm version:"
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                retry(3) {
                    sh '''
                        # Install dependencies with retry logic
                        echo "Installing dependencies..."

                        # Try npm ci first (faster and more reliable)
                        if npm ci --no-audit --no-fund 2>/dev/null; then
                            echo "✅ Dependencies installed successfully with npm ci"
                        else
                            echo "⚠️  npm ci failed, falling back to npm install..."
                            # Fallback to npm install if npm ci fails
                            npm install --no-audit --no-fund
                        fi
                    '''
                }
            }
        }

        stage('Generate Prisma Client') {
            steps {
                sh '''
                    # Generate Prisma client
                    npx prisma generate
                '''
            }
        }

        stage('Build Application') {
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
            steps {
                sh '''
                    # Build Next.js application with increased memory (3GB for faster builds)
                    # and optimization flags
                    export NODE_OPTIONS='--max-old-space-size=3072'
                    export NEXT_TELEMETRY_DISABLED=1

                    echo "Starting build at $(date) with NODE_OPTIONS=$NODE_OPTIONS"
                    echo "Current memory info:"
                    free -h || true

                    # Run build with timing
                    time npm run build

                    echo "✅ Build completed successfully at $(date)"

                    # Show build output size
                    du -sh .next 2>/dev/null || true
                '''
            }
        }

        // Tests disabled - Playwright browsers not installed on Jenkins server
        // To enable: run 'npx playwright install --with-deps' on Jenkins server
        // stage('Run Tests') {
        //     when {
        //         expression { fileExists('playwright.config.ts') }
        //     }
        //     steps {
        //         catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
        //             sh 'npm run test || true'
        //         }
        //     }
        // }

        stage('Deploy to Server') {
            steps {
                withCredentials([string(credentialsId: 'tarl-pratham-db-password', variable: 'DB_PASSWORD')]) {
                    sh '''
                        # Create deployment package
                        tar -czf ${APP_NAME}.tar.gz \
                            --exclude='node_modules' \
                            --exclude='.git' \
                            --exclude='*.log' \
                            --exclude='.env*' \
                            --exclude='backups' \
                            --exclude='*.md' \
                            --exclude='*.sh' \
                            --exclude='test-*.js' \
                            .next/ prisma/ public/ app/ components/ lib/ styles/ \
                            package.json package-lock.json \
                            next.config.ts tailwind.config.ts tsconfig.json \
                            middleware.ts postcss.config.mjs eslint.config.mjs \
                            tarl-pratham.service 2>/dev/null || true

                        # Copy to server
                        scp -o StrictHostKeyChecking=no ${APP_NAME}.tar.gz ${SERVER_USER}@localhost:~

                        # Deploy on server
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@localhost << 'ENDSSH'
                            set -e

                            # Create app directory if not exists
                            sudo mkdir -p /opt/tarl-pratham

                            # Set ownership to ubuntu user
                            sudo chown -R ubuntu:ubuntu /opt/tarl-pratham

                            # Extract to app directory
                            tar -xzf ~/tarl-pratham.tar.gz -C /opt/tarl-pratham
                            rm ~/tarl-pratham.tar.gz

                            # Create .env file with production settings
                            sudo tee /opt/tarl-pratham/.env > /dev/null << EOF
DATABASE_URL="postgres://admin:${DB_PASSWORD}@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=5&statement_timeout=30000&idle_in_transaction_session_timeout=30000&connection_limit=3&pool_timeout=5"
POSTGRES_PRISMA_URL="postgres://admin:${DB_PASSWORD}@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=5&statement_timeout=30000&idle_in_transaction_session_timeout=30000&connection_limit=3&pool_timeout=5"
POSTGRES_URL_NON_POOLING="postgres://admin:${DB_PASSWORD}@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10"
NEXTAUTH_URL="https://tarl.openplp.com"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NODE_ENV="production"
PORT="3006"
EOF

                            # Install production dependencies
                            cd /opt/tarl-pratham
                            echo "Installing production dependencies..."

                            # Try npm ci first, fallback to npm install if it fails
                            if npm ci --omit=dev --no-audit --no-fund 2>/dev/null; then
                                echo "✅ Production dependencies installed with npm ci"
                            else
                                echo "⚠️  npm ci failed, using npm install..."
                                npm install --omit=dev --no-audit --no-fund
                            fi

                            # Generate Prisma client on server
                            npx prisma generate

                            # Ensure correct ownership
                            sudo chown -R ubuntu:ubuntu /opt/tarl-pratham

                            # Check if PM2 is installed, if not use systemd
                            if command -v pm2 &> /dev/null; then
                                echo "Deploying with PM2..."

                                # Stop existing PM2 process if running
                                pm2 stop tarl-pratham 2>/dev/null || true
                                pm2 delete tarl-pratham 2>/dev/null || true

                                # Start with PM2 (increased memory for production)
                                NODE_OPTIONS='--max-old-space-size=2048' \
                                PORT=3006 \
                                pm2 start npm --name tarl-pratham -- run start:prod

                                # Save PM2 configuration
                                pm2 save

                                # Check status
                                pm2 list
                            else
                                echo "Deploying with systemd..."

                                # Copy/update service file
                                if [ -f /opt/tarl-pratham/tarl-pratham.service ]; then
                                    sudo cp /opt/tarl-pratham/tarl-pratham.service /etc/systemd/system/
                                else
                                    # Create service file if not provided
                                    sudo tee /etc/systemd/system/tarl-pratham.service > /dev/null << SERVICE_FILE
[Unit]
Description=TaRL Pratham Next.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/opt/tarl-pratham
Environment=NODE_ENV=production
Environment=PORT=3006
Environment=NODE_OPTIONS=--max-old-space-size=2048
EnvironmentFile=/opt/tarl-pratham/.env
ExecStart=/usr/bin/npm run start:prod
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE_FILE
                                fi

                                sudo systemctl daemon-reload
                                sudo systemctl enable tarl-pratham
                                sudo systemctl restart tarl-pratham

                                # Wait for service to start
                                sleep 5

                                # Check status
                                sudo systemctl status tarl-pratham --no-pager -l
                            fi
ENDSSH
                    '''
                }
            }
        }

        stage('Database Migration') {
            when {
                expression {
                    // Only run migrations if schema has changed in this commit
                    sh(returnStatus: true, script: 'git diff HEAD~1 --name-only | grep -q "prisma/schema.prisma"') == 0
                }
            }
            steps {
                withCredentials([string(credentialsId: 'tarl-pratham-db-password', variable: 'DB_PASSWORD')]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ${SERVER_USER}@localhost << 'ENDSSH'
                            cd /opt/tarl-pratham

                            # Run database push (safer than migrate for production)
                            DATABASE_URL="postgres://admin:${DB_PASSWORD}@157.10.73.82:5432/tarl_pratham" \
                            npx prisma db push --skip-generate

                            echo "Database schema updated successfully"
ENDSSH
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    # Wait for application to start
                    sleep 10

                    # Check if the application is responding
                    MAX_RETRIES=5
                    RETRY_COUNT=0

                    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
                        if curl -f http://localhost:3006 > /dev/null 2>&1; then
                            echo "✅ Application is running successfully!"
                            echo "Dashboard accessible at: http://${SERVER_HOST}:3006"
                            break
                        fi

                        RETRY_COUNT=$((RETRY_COUNT + 1))
                        echo "Health check attempt $RETRY_COUNT failed, retrying in 5 seconds..."
                        sleep 5
                    done

                    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
                        echo "❌ Health check failed after $MAX_RETRIES attempts"
                        ssh ${SERVER_USER}@localhost "sudo systemctl status tarl-pratham --no-pager -l || pm2 logs tarl-pratham --lines 50" || true
                        exit 1
                    fi

                    # CRITICAL: Verify app is listening on 0.0.0.0 (not 127.0.0.1)
                    ssh -o StrictHostKeyChecking=no ${SERVER_USER}@localhost << 'ENDSSH'
                        echo "=== Verifying Network Binding ==="
                        LISTEN_ADDR=$(sudo ss -tlnp | grep :3006 | awk '{print $4}')
                        echo "App listening on: $LISTEN_ADDR"

                        if echo "$LISTEN_ADDR" | grep -q "0.0.0.0:3006"; then
                            echo "✅ CORRECT: App is listening on 0.0.0.0:3006 (accessible from Docker/NPM)"
                        elif echo "$LISTEN_ADDR" | grep -q "127.0.0.1:3006"; then
                            echo "❌ ERROR: App is listening on 127.0.0.1:3006 (NOT accessible from Docker/NPM)"
                            echo "This means Nginx Proxy Manager cannot reach the app!"
                            exit 1
                        else
                            echo "⚠️  WARNING: Unexpected listening address"
                        fi
ENDSSH

                    echo "✅ Deployment successful and network binding verified!"
                    echo "Local access: http://localhost:3006"
                    echo "Server access: http://10.1.73.82:3006"
                    echo "Public URL (via NPM): Configure in Nginx Proxy Manager"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
            // Clean up build artifacts
            sh 'rm -f ${APP_NAME}.tar.gz'
        }
        success {
            echo '''
                ╔══════════════════════════════════════════╗
                ║  🎉 Deployment successful!               ║
                ║                                          ║
                ║  Application: TaRL Pratham              ║
                ║  URL: http://157.10.73.82:3006          ║
                ║  Environment: Production                 ║
                ╚══════════════════════════════════════════╝
            '''
        }
        failure {
            echo '''
                ╔══════════════════════════════════════════╗
                ║  ❌ Deployment failed!                   ║
                ║                                          ║
                ║  Check the logs for details              ║
                ║  Rollback may be required                ║
                ╚══════════════════════════════════════════╝
            '''
        }
    }
}
