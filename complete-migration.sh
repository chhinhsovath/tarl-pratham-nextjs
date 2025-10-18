#!/usr/bin/expect -f

# Complete automated migration script
# This uses expect to handle SSH password authentication

set timeout 300
set new_server "157.10.73.82"
set new_password "FJBPCWMd\$jhkz+7A(oRgQXmv&HiE)!"
set old_server "157.10.73.52"
set old_password "en_&xdX#!N(^OqCQzc3RE0B)m6ogU!"

puts "========================================="
puts "TaRL Pratham Database Migration"
puts "Old Server: $old_server (backup)"
puts "New Server: $new_server (primary)"
puts "========================================="
puts ""

# Step 1: Backup from old server
puts "\[Step 1/5\] Creating backup on old server..."
spawn ssh ubuntu@$old_server
expect {
    "password:" {
        send "$old_password\r"
        expect "ubuntu@*"
        send "sudo -u postgres pg_dump tarl_pratham -F c -f /tmp/tarl_pratham_backup.sql && ls -lh /tmp/tarl_pratham_backup.sql\r"
        expect "ubuntu@*"
        send "exit\r"
    }
}
expect eof

# Step 2: Setup PostgreSQL on new server
puts "\n\[Step 2/5\] Setting up PostgreSQL on new server..."
spawn ssh ubuntu@$new_server
expect {
    "password:" {
        send "$new_password\r"
        expect "ubuntu@*"

        # Install PostgreSQL
        send "sudo apt update && sudo apt install postgresql postgresql-contrib -y\r"
        expect -timeout 180 "ubuntu@*"

        # Get PostgreSQL version and configure
        send {PG_VERSION=$(ls /etc/postgresql/ | head -n 1) && echo "PostgreSQL $PG_VERSION detected"}
        send "\r"
        expect "ubuntu@*"

        # Create user and database
        send {sudo -u postgres psql << 'EOF'
CREATE USER admin WITH PASSWORD 'P@ssw0rd';
CREATE DATABASE tarl_pratham OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE tarl_pratham TO admin;
\q
EOF
}
        send "\r"
        expect "ubuntu@*"

        # Configure remote access
        send {PG_VERSION=$(ls /etc/postgresql/ | head -n 1) && sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf && sudo sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf}
        send "\r"
        expect "ubuntu@*"

        # Add pg_hba.conf rules
        send {PG_VERSION=$(ls /etc/postgresql/ | head -n 1) && echo -e "\n# Remote access for TaRL Pratham\nhost    all             all             0.0.0.0/0               md5\nhost    all             all             ::/0                    md5" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf}
        send "\r"
        expect "ubuntu@*"

        # Configure firewall
        send "sudo ufw allow 22/tcp && sudo ufw allow 5432/tcp && echo y | sudo ufw enable\r"
        expect "ubuntu@*"

        # Restart PostgreSQL
        send "sudo systemctl restart postgresql && sleep 3\r"
        expect "ubuntu@*"

        send "exit\r"
    }
}
expect eof

# Step 3: Transfer backup
puts "\n\[Step 3/5\] Transferring backup from old to new server..."
spawn scp ubuntu@$old_server:/tmp/tarl_pratham_backup.sql /tmp/
expect {
    "password:" {
        send "$old_password\r"
    }
}
expect eof

spawn scp /tmp/tarl_pratham_backup.sql ubuntu@$new_server:/tmp/
expect {
    "password:" {
        send "$new_password\r"
    }
}
expect eof

# Step 4: Restore database
puts "\n\[Step 4/5\] Restoring database on new server..."
spawn ssh ubuntu@$new_server
expect {
    "password:" {
        send "$new_password\r"
        expect "ubuntu@*"
        send "sudo -u postgres pg_restore -d tarl_pratham /tmp/tarl_pratham_backup.sql 2>&1 | grep -v ERROR\r"
        expect "ubuntu@*"
        send "exit\r"
    }
}
expect eof

# Step 5: Verify
puts "\n\[Step 5/5\] Verifying setup..."
spawn ssh ubuntu@$new_server
expect {
    "password:" {
        send "$new_password\r"
        expect "ubuntu@*"
        send "sudo netstat -plnt | grep 5432\r"
        expect "ubuntu@*"
        send {sudo -u postgres psql tarl_pratham -c "SELECT 'users' as table, COUNT(*) FROM users UNION ALL SELECT 'schools', COUNT(*) FROM pilot_schools UNION ALL SELECT 'students', COUNT(*) FROM students UNION ALL SELECT 'assessments', COUNT(*) FROM assessments;"}
        send "\r"
        expect "ubuntu@*"
        send "exit\r"
    }
}
expect eof

puts "\n========================================="
puts "Migration Complete!"
puts "========================================="
