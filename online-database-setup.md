# Online PostgreSQL Database Setup Guide

This guide will help you set up your School Management System with an online PostgreSQL database.

## Option 1: Supabase (Recommended - Free Tier)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Database Credentials
1. In your Supabase dashboard, go to **Settings** → **Database**
2. Copy the connection information:
   - Host: `db.your-project-ref.supabase.co`
   - Database: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: (found in the database settings)

### Step 3: Configure Your Backend
Update your `backend/config.env` file:

```env
# Supabase Configuration
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Step 4: Initialize Database
```bash
cd backend
# Connect to Supabase and run the schema
psql "postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres" -f database/schema.sql
```

## Option 2: Neon (Serverless PostgreSQL)

### Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Database Credentials
1. In your Neon dashboard, go to **Connection Details**
2. Copy the connection string or individual credentials:
   - Host: `ep-cool-name-123456.us-east-1.aws.neon.tech`
   - Database: `neondb`
   - Port: `5432`
   - User: `your-neon-user`
   - Password: `your-neon-password`

### Step 3: Configure Your Backend
Update your `backend/config.env` file:

```env
# Neon Configuration
DB_HOST=ep-cool-name-123456.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=your-neon-user
DB_PASSWORD=your-neon-password
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Step 4: Initialize Database
```bash
cd backend
# Connect to Neon and run the schema
psql "postgresql://your-user:your-password@ep-cool-name-123456.us-east-1.aws.neon.tech:5432/neondb" -f database/schema.sql
```

## Option 3: Railway

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up for an account
3. Create a new project

### Step 2: Add PostgreSQL Service
1. Click **New Service** → **Database** → **PostgreSQL**
2. Wait for the database to be provisioned
3. Go to **Variables** tab to get connection details

### Step 3: Configure Your Backend
Update your `backend/config.env` file:

```env
# Railway Configuration
DB_HOST=containers-us-west-1.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your-railway-password
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Step 4: Initialize Database
```bash
cd backend
# Connect to Railway and run the schema
psql "postgresql://postgres:your-password@containers-us-west-1.railway.app:5432/railway" -f database/schema.sql
```

## Option 4: Heroku Postgres

### Step 1: Create Heroku Account
1. Go to [heroku.com](https://heroku.com)
2. Sign up for an account
3. Create a new app

### Step 2: Add PostgreSQL Add-on
1. In your Heroku dashboard, go to **Resources** tab
2. Click **Find more add-ons**
3. Search for "Heroku Postgres" and add it
4. Choose the plan (Hobby Dev is free)

### Step 3: Get Database Credentials
1. Go to **Settings** → **Config Vars**
2. Click **Reveal Config Vars**
3. Find `DATABASE_URL` and copy the connection string

### Step 4: Configure Your Backend
Update your `backend/config.env` file:

```env
# Heroku Configuration
DB_HOST=your-app-name.herokuapp.com
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-heroku-user
DB_PASSWORD=your-heroku-password
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Step 4: Initialize Database
```bash
cd backend
# Connect to Heroku and run the schema
psql "postgresql://your-user:your-password@your-app-name.herokuapp.com:5432/your-database-name" -f database/schema.sql
```

## Option 5: AWS RDS

### Step 1: Create AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Sign up for an account
3. Navigate to RDS service

### Step 2: Create RDS Instance
1. Click **Create database**
2. Choose **PostgreSQL**
3. Select **Free tier** for testing
4. Configure security groups to allow your IP
5. Note down the endpoint and credentials

### Step 3: Configure Your Backend
Update your `backend/config.env` file:

```env
# AWS RDS Configuration
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-rds-user
DB_PASSWORD=your-rds-password
DB_SSL=true

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

## Testing the Connection

### Step 1: Test Database Connection
```bash
cd backend
npm run dev
```

You should see: `Connected to PostgreSQL database successfully!`

### Step 2: Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test students endpoint
curl http://localhost:5000/api/students
```

### Step 3: Test Frontend Integration
1. Start your frontend: `cd frontend && npm run dev`
2. Open http://localhost:5173
3. Navigate to different pages to verify data is loading

## Environment Variables for Production

For production deployment, you can use environment variables instead of config files:

```bash
# Set environment variables
export DB_HOST=your-online-db-host
export DB_PORT=5432
export DB_NAME=your-database-name
export DB_USER=your-username
export DB_PASSWORD=your-password
export DB_SSL=true
export PORT=5000
export NODE_ENV=production
export JWT_SECRET=your-secure-jwt-secret
```

## Troubleshooting

### Common Issues:

1. **SSL Connection Error**
   - Ensure `DB_SSL=true` is set for online databases
   - Check if your database provider requires SSL

2. **Connection Timeout**
   - Verify your IP is whitelisted (if required)
   - Check firewall settings
   - Ensure database is running

3. **Authentication Error**
   - Double-check username and password
   - Verify database name is correct
   - Ensure user has proper permissions

4. **Port Issues**
   - Most online PostgreSQL providers use port 5432
   - Check if your provider uses a different port

### Testing Connection with psql:
```bash
# Test connection directly
psql "postgresql://username:password@host:port/database"

# If successful, you'll see the psql prompt
# Type \q to exit
```

## Security Best Practices

1. **Never commit credentials to version control**
2. **Use environment variables in production**
3. **Enable SSL for all online connections**
4. **Use strong passwords**
5. **Regularly rotate database credentials**
6. **Limit database access to necessary IPs only**

## Cost Comparison

| Provider | Free Tier | Paid Plans |
|----------|-----------|------------|
| Supabase | 500MB, 2 projects | $25/month |
| Neon | 3GB, unlimited projects | $0.10/GB |
| Railway | $5 credit/month | Pay-as-you-go |
| Heroku | 10,000 rows | $5/month |
| AWS RDS | 750 hours/month | Pay-as-you-go |

## Recommendation

For a school management system, I recommend **Supabase** because:
- Generous free tier
- Easy setup and management
- Built-in authentication (can be added later)
- Real-time subscriptions
- Good documentation and support
