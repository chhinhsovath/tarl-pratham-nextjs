# Supabase Credentials - TARL OpenPLP Project

## Project Information
- **Project ID**: uyrmvvwwchzmqtstgwbi
- **Project Name**: TARL OpenPLP
- **Region**: US East 1 (AWS)
- **Dashboard**: https://supabase.com/dashboard/project/uyrmvvwwchzmqtstgwbi

## Database Connection Details

### Primary Connection (Transaction Mode - PgBouncer)
```
Host:     aws-1-us-east-1.pooler.supabase.com
Port:     6543
User:     postgres.uyrmvvwwchzmqtstgwbi
Password: QtMVSsu8uw60WRjK
Database: postgres
```

**Full URL:**
```
postgres://postgres.uyrmvvwwchzmqtstgwbi:QtMVSsu8uw60WRjK@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

### Direct Connection (Session Mode - No Pooling)
```
Host:     aws-1-us-east-1.pooler.supabase.com
Port:     5432
User:     postgres.uyrmvvwwchzmqtstgwbi
Password: QtMVSsu8uw60WRjK
Database: postgres
```

**Full URL:**
```
postgres://postgres.uyrmvvwwchzmqtstgwbi:QtMVSsu8uw60WRjK@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

## API Credentials

### Supabase URL
```
https://uyrmvvwwchzmqtstgwbi.supabase.co
```

### Anonymous Key (Public - Safe for Client-Side)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cm12dnd3Y2h6bXF0c3Rnd2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTk4NDQsImV4cCI6MjA3NTMzNTg0NH0.00MKW0IYlq2qMHBQu4DsMYRz2EoQ4jnJYlXIwvabhQA
```

### Service Role Key (Secret - Server-Side Only)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cm12dnd3Y2h6bXF0c3Rnd2JpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc1OTg0NCwiZXhwIjoyMDc1MzM1ODQ0fQ.4TMdVWhsPTLoNig8eOFRaxQXZ2NClbrNZgLrsqVvnMk
```

### JWT Secret
```
4+YhWi29b8DPYFJQHq5Wv9PjZL6sa7riCgZj/aWxxQnNPhbeSjDJpqeNxI+YOIt1c2JRsPLO6wMQhm6hW2Guwg==
```

---

✅ **All credentials configured in migration scripts**
✅ **Ready to migrate**: Run `./migrate-to-supabase.sh`
